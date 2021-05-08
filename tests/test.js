const request = require("supertest"); // Import supertest
const app = require("../index"); // Import app
const { user } = require("../models"); // Import user and transaksi models
let token;

beforeAll(async () => {
  await user.destroy({ where: {}, force: true });
});

// auth test
describe("Auth Test", () => {
  describe("/signup POST", () => {
    it("It should get a token from user sign up user", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "test user",
        email: "user@gmail.com",
        password: "User123#",
        confirmPassword: "User123#",
        phone_number: "08123456789",
        city_or_regional: "indonesia",
        postal_code: 123456,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");
    });

    it("It should get an error", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "test user",
        email: "user@gmail.com",
        password: "User123#",
        confirmPassword: "User123#",
        phone_number: "08123456789",
        city_or_regional: "indonesia",
        postal_code: 123456,
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("This email is already in use");
    });

    it("It should get an error", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "test user1",
        email: "user@gmail.com",
        password: "User123#",
        confirmPassword: "User123#",
        phone_number: "08123456789",
        city_or_regional: "indonesia",
        postal_code: 123456,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Name can not contain number");
    });

    it("It should get an error", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "test user",
        email: "user@gmail",
        password: "User123#",
        confirmPassword: "User123#",
        phone_number: "08123456789",
        city_or_regional: "indonesia",
        postal_code: 123456,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please insert a valid email");
    });

    it("It should get an error", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "test user",
        email: "user@gmail.com",
        password: "pass",
        confirmPassword: "User123#",
        phone_number: "08123456789",
        city_or_regional: "indonesia",
        postal_code: 123456,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "Password has no upper case, Password has no number case, Password has no symbol case, confirmation password must be same as password"
      );
    });
  });
});

describe("/signin POST", () => {
  it("It should get a token", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "user@gmail.com",
      password: "User123#",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Success");
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  it("It should get an email error", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "user@gmail123.com",
      password: "User123#",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Email or password is wrong");
  });

  it("It should get an password error", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "user@gmail.com",
      password: "User123###",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toEqual("Email or password is wrong");
  });
});

// user test
describe("User Test", () => {
  describe("/user/", () => {
    it("It should get one user", async () => {
      const res = await request(app)
        .get("/user/1")
        .set("Authorization", `bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });
  });
});

