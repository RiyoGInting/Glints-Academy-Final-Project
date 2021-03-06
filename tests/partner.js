const e = require("express");

module.exports = partnerTest = () => {
  const request = require("supertest"); // Import supertest
  const app = require("../index"); // Import app
  const { user, partner } = require("../models"); // Import user and transaksi models
  let token;
  let tokenPartner;
  let idPartner;
  let id_partner;
  const jwt = require("jsonwebtoken");

  beforeAll(async () => {
    await partner.destroy({ where: {}, force: true });
    await user.destroy({ where: {}, force: true });
  });

  describe("Sign Up User", () => {
    describe("/signup POST", () => {
      it("It should get a token from user sign up user", async () => {
        const res = await request(app).post("/auth/signup").send({
          name: "test user",
          email: "useradmin@gmail.com",
          password: "User123#",
          confirmPassword: "User123#",
          phone_number: "+62123456789",
          city_or_regional: "indonesia",
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

  // sign up partner
  describe("Sign Up Partner", () => {
    describe("/signup/partner POST", () => {
      it("It should get a token from user sign up partner", async () => {
        const res = await request(app)
          .post("/auth/signup/partner")
          .field({
            name: "your partner",
            email: "partner1@gmail.com",
            password: "Qwerty123!",
            confirmPassword: "Qwerty123!",
            brand_service_name: "Service Partner 1",
            phone_number: "+6285731853334",
            business_phone: "+6285731853334",
            business_address: "Jalan Bongkaran No 17, Surabaya",
            service_fee: 175000,
            ktp_address: "Slompretan 37, Surabaya",
            owner_address: "Slompretan 37, Surabaya",
            category_name: "Automotive",
            id_category: 2,
          })
          .attach("ktp_image", "tests/q.jpg")
          .attach("partner_logo", "tests/q.jpg");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("token");
        tokenPartner = res.body.token;

        idPartner = await partner.findOne({
          where: {
            email: "partner1@gmail.com",
          },
        });
      });
    });
  });

  describe("Test Controller Partner", () => {
    describe("/partner PUT", () => {
      it("It should verified partner by admin", async () => {
        id_partner = idPartner.id;
        const res = await request(app)
          .put(`/partner/adminVerified/${id_partner}`)
          .set("Authorization", `bearer ${token}`)
          .send({ verified_status: "verified" });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Status udpdated");
        expect(res.body).toHaveProperty("data");
      });

      it("It should update partner logo", async () => {
        const res = await request(app)
          .put(`/partner/updateLogoPartner/`)
          .set("Authorization", `bearer ${tokenPartner}`)
          .attach("partner_logo", "tests/q.jpg");

        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Status udpdated");
        expect(res.body).toHaveProperty("data");
      });

      // it("It should update partner service", async () => {
      //   const res = await request(app)
      //     .put(`/partner/updateService`)
      //     .set("Authorization", `bearer ${tokenPartner}`)
      //     .send({
      //       category_name: "Automotive",
      //       brand_service_name: "Service Computer",
      //       service_fee: 800000,
      //       service_description: "Service Description",
      //       business_address: "jalan business address",
      //       business_phone: "+6285731853324",
      //     });

      //   expect(res.statusCode).toEqual(201);
      //   expect(res.body).toBeInstanceOf(Object);
      //   expect(res.body.message).toEqual("Success");
      //   expect(res.body).toHaveProperty("dataUpdate");
      // });

      it("It should update partner profile", async () => {
        const res = await request(app)
          .put(`/partner/updateProfile`)
          .set("Authorization", `bearer ${tokenPartner}`)
          .send({
            name: "name partner",
            phone_number: "+6285731853324",
            ktp_address: "ktp_address",
            owner_address: "owner_address",
          });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("data");
      });
    });

    describe("/partner GET", () => {
      it("It should get all partner verified", async () => {
        const res = await request(app).get(
          `/partner/?verified_status=verified`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("data");
      });

      it("It should get one partner verified", async () => {
        const res = await request(app)
          .get(`/partner/getOne/${id_partner}`)
          .set("Authorization", `bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("data");
      });

      it("It should get one partner verified profile", async () => {
        const res = await request(app)
          .get(`/partner/getPartner`)
          .set("Authorization", `bearer ${tokenPartner}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("data");
      });

      // it("It should get all partner by search name", async () => {
      //   const res = await request(app).get(
      //     `/partner/searchByName?brand_service_name=service&page=1`
      //   );
      //   expect(res.statusCode).toEqual(200);
      //   expect(res.body).toBeInstanceOf(Object);
      //   expect(res.body.message).toEqual("Success");
      //   expect(res.body).toHaveProperty("data");
      // });

      // it("It should get all partner by category", async () => {
      //   const res = await request(app).get(
      //     `/partner/filterByCategory?id_category=2&page=1`
      //   );
      //   expect(res.statusCode).toEqual(200);
      //   expect(res.body).toBeInstanceOf(Object);
      //   expect(res.body.message).toEqual("Success");
      //   expect(res.body).toHaveProperty("data");
      // });

      // it("It should get all partner by filter", async () => {
      //   const res = await request(app).get(
      //     `/partner/searchByFilter?page=1&min_price=&max_price=&min_rating=&max_rating=4&business_address=jalan`
      //   );
      //   expect(res.statusCode).toEqual(200);
      //   expect(res.body).toBeInstanceOf(Object);
      //   expect(res.body.message).toEqual("Success");
      //   expect(res.body).toHaveProperty("data");
      // });
    });
  });
};
