const request = require("supertest");
const app = require("../index");
const { user, category } = require("../models");

let token;
let id_user;

beforeAll(async () => {
  await user.destroy({ where: {}, force: true });
  await category.destroy({ where: {}, force: true });
});

// sign up as admin (for admin token)
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

describe("Category Test", ()=> {
    describe("/GET category/", ()=> {
      // Get All Category - Data not found
      it("Get All Category - Data not found", async ()=> {
        const res = await request(app)
          .get('/category/')
          .send({})
        expect(res.statusCode).toEqual(404)
        expect(res.body).toBeInstanceOf(Object)
        expect(res.body.message).toEqual("Data not found")
      });

      // Get all categories- success
      it("It should GET all categories- success", async ()=> {
        const res = await request(app)
        .get('/category/')
        .send({})
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeInstanceOf(Object)
        expect(res.body.message).toEqual("Success")
      });

      // Get One Category - success
      it("Gets one category", async ()=> {
        const res = await request(app)
          .get(`/category/${id_category.id}`)
          .send({});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });

      // Get One Category - Data not found
      it("Gets one category - data not found", async ()=> {
        const res = await request(app)
          .get(`/category/100`)
          .send({});
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });

      // Update category - success
      it("update category - success", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .put(`/category/${id_category.id}`)
          .set("Authorization", `bearer ${token}`)
          .send({
            id_category: id_category.id,
          })
          .attach("category_icon", "tests/q.jpg");
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Status updated");
      });

      // Update category - file must be an image
      it("update category - internal server error", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .put(`/category/${idTransaction.id}`)
          .set("Authorization", `bearer ${token}`)
          .send({
            id_category: id_category.id,
          })
          .attach("category_icon", "tests/not_image.pdf");
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("File must be an image");
      });

      // Update category - file must be less than 1 MB
      it("update category - internal server error", async () => {
        id_user = jwt.decode(token).user.id;
        const res = await request(app)
          .put(`/category/${idTransaction.id}`)
          .set("Authorization", `bearer ${token}`)
          .send({
            id_category: id_category.id,
          })
          .attach("category_icon", "tests/moreThan1MB.jpg");
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Image must be less than 1MB");
      });

      // Update category - internal server error
      it("update category - internal server error", async () => {
        const res = await request(app)
          .put(`/category/${idTransaction.id}`)
          .set("Authorization", `bearer ${token}`)
          .send({
            id_category: id_category.id,
          })
          .attach("category_icon", "tests/q.jpg");
        expect(res.statusCode).toEqual(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Internal Server Error");
      });
    })
})
