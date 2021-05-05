const request = require("supertest"); // Import supertest
const app = require("../index"); // Import app
const { user } = require("../models"); // Import user and transaksi models
let token;


beforeAll(async () => {
    await user.destroy({ where: {}, force: true });
  });

// test users
describe("Auth Test", () => {
    describe("/signup POST", () => {
        it("It should get a token from user sign up user", async () => {
            const res = await request(app).post("/auth/signup").send({
                name: "test user",
                email: "user@gmail.com",
                password: "User123#",
                confirmPassword: "User123#",
                phone_number: "08123456789",
                address: "indonesia",
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.message).toEqual("Success");
            expect(res.body).toHaveProperty("token");      
        })
    })
})