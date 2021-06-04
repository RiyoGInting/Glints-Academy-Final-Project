module.exports = blogTest = () => {
  const request = require("supertest");
  const jwt = require("jsonwebtoken");
  const app = require("../index");
  const { user, blog } = require("../models");

  let token;
  let id_user;

  beforeAll(async () => {
    await user.destroy({ where: {}, force: true });
    await blog.destroy({ where: {}, force: true });
  });

  // sign up user
  describe("Sign Up User", () => {
    describe("/signup POST", () => {
      it("It should get admin token from user sign up", async () => {
        const res = await request(app).post("/auth/signup").send({
          name: "admin",
          email: "admin@gmail.com",
          password: "Admin123!",
          confirmPassword: "Admin123!",
          phone_number: "+62123456789",
          city_or_regional: "Semarang",
          postal_code: 12345,
          role: "admin",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
      });
    });
  });

  describe("Blog Test", () => {
    describe("/blog/ GET", () => {
      // Create Blog - Success
      it("Create Blog - Success ", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .post("/blog/")
          .set("Authorization", `bearer ${token}`)
          .field({
            id_user: id_user,
            title: "15 Laundry Terbaik di Narnia!",
            article: "Narnia itu khayalan doang, bro.",
          })
          .attach("blog_image", "tests/q.jpg");
        console.log(res.body);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Article successfully posted");
        id_blog = await blog.findOne({
          where: {
            id_user: id_user,
          },
        });
      });

      // Get All
      it("get all blogs (1st page) - success", async () => {
        const res = await request(app)
          .get("/blog/")
          .query({ limit: 3, page: 1 });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
      // Get One Blog - Success
      it("Get One Blog - success", async () => {
        const res = await request(app).get(`/blog/${id_blog.id}`).send({});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
      // Get One Blog - not found
      it("Get One Blog - not found", async () => {
        const res = await request(app).get("/blog/100").send({});
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });

      // // Update Blog - Success
      // it("Update Blog - Success ", async ()=> {
      //   const id_blog = created.body.data.id;
      //   const res = await request(app)
      //   .put('/blog/${id_blog}')
      //   .set('Authorization', `bearer ${token}`)
      //   .send({
      //     id_user: "15",
      //     title: "20 Laundry Terbaik di Narnia!",
      //     article: "Tambahin 5 lagi, Walaupun Narnia itu khayalan doang, bro.",
      //   })
      //   .attach("blog_image", "tests/Stardust.jpg");

      //   expect(res.statusCode).toEqual(201)
      //   expect(res.body).toBeInstanceOf(Object)
      //   expect(res.body.message).toEqual("Successfully updated")
      // });

      // // Update Blog - Blog not found
      // it("Update Blog - Blog not found", async ()=> {
      //   const id_blog = created.body.data.id;
      //   const res = await request(app)
      //   .put('/blog/${id_blog}')
      //   .set('Authorization', `bearer ${token}`)
      //   .send({
      //     id_user: "15",
      //     title: "20 Laundry Terbaik di Narnia!",
      //     article: "Tambahin 5 lagi deh, walaupun Narnia itu khayalan doang, bro.",
      //   })
      //   .attach("blog_image", "tests/Stardust.jpg");

      //   expect(res.statusCode).toEqual(404)
      //   expect(res.body).toBeInstanceOf(Object)
      //   expect(res.body.message).toEqual("Article not found")
      // });

      // Delete Blog - Success
      it("Delete Blog - Success", async () => {
        // const id_blog = created.body.data.id;
        res = await request(app)
          .delete(`/blog/${id_blog.id}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Article successfully deleted");
      });
      // Delete Blog - Blog Not Found
      it("Delete Blog - Not found", async () => {
        // const id_blog = created.body.data.id;
        res = await request(app)
          .delete(`/blog/${id_blog.id + 100}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Articles not found");
      });
    });
  });
};
