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
      // Get All blogs -data not found
      it("get all blogs - data not found", async () => {
        const res = await request(app)
          .get("/blog/")
          .query({ limit: 3, page: 1 });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("No articles not found");
      });

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

      // Create Blog - File must be an image
      it("Create Blog - File must be an image ", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .post("/blog/")
          .set("Authorization", `bearer ${token}`)
          .field({
            id_user: id_user,
            title: "15 Laundry Terbaik di Narnia!",
            article: "Narnia itu khayalan doang, bro.",
          })
          .attach("blog_image", "tests/not_image.pdf");
        console.log(res.body);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("File must be an image");
        id_blog = await blog.findOne({
          where: {
            id_user: id_user,
          },
        });
      });

      // Create Blog - Image must be less than 1 MB
      it("Create Blog - Image must be less than 1 MB", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .post("/blog/")
          .set("Authorization", `bearer ${token}`)
          .field({
            id_user: id_user,
            title: "15 Laundry Terbaik di Narnia!",
            article: "Narnia itu khayalan doang, bro.",
          })
          .attach("blog_image", "tests/moreThan1MB.jpg");
        console.log(res.body);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Image must be less than 1MB");
        id_blog = await blog.findOne({
          where: {
            id_user: id_user,
          },
        });
      });

      // Create Blog - User not found
      it("Create Blog - User not found", async () => {
        id_user = jwt.decode(token).user.id + 1;
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
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("User not found");
        id_blog = await blog.findOne({
          where: {
            id_user: id_user,
          },
        });
      });

      // Get All blogs - success
      it("get all blogs - success", async () => {
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

      // Update Blog - Success
      it("update blog - success", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .put(`/blog/${id_blog.id}`)
          .set("Authorization", `bearer ${token}`)
          .field({
            id_blog: id_blog.id,
            title: "20 Laundry Terbaik di Narnia!",
            article: "Tambah 20.",
          })
          .attach("blog_image", "tests/q.jpg");
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Successfully updated");
      });
      // Update blog - blog not found
      it("update blog - blog not found", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .put(`/blog/100`)
          .set("Authorization", `bearer ${token}`)
          .field({
            id_blog: id_blog.id,
            title: "20 Laundry Terbaik di Narnia!",
            article: "Tambah 20.",
          })
          .attach("blog_image", "tests/q.jpg");
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Article not found");
      });

      // Update blog - User not found
      it("update blog - user not found", async () => {
        id_user = jwt.decode(token).user.id + 1;
        const res = await request(app)
          .put(`/blog/${id_blog.id}`)
          .set("Authorization", `bearer ${token}`)
          .field({
            id_blog: id_blog.id,
            title: "20 Laundry Terbaik di Narnia!",
            article: "Tambah 20.",
          })
          .attach("blog_image", "tests/q.jpg");
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("User not found");
      });
      // Update Blog - Internal Server Error
      it("update blog - success", async () => {
        const res = await request(app)
          .put(`/blog/${id_blog.id}`)
          .set("Authorization", `bearer ${token}`)
          .field({
            id_blog: id_blog.id,
            title: "20 Laundry Terbaik di Narnia!",
            article: "Tambah 20.",
          })
          .attach("blog_image", "tests/q.jpg");
        expect(res.statusCode).toEqual(500);
        expect(res.body).toBeInstanceOf(Object);
      });

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
