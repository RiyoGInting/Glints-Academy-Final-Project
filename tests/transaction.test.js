const request = require("supertest"); // Import supertest
const app = require("../index"); // Import app
const { user, partner, transaction } = require("../models"); // Import user and transaksi models
const midtrans = "U0ItTWlkLXNlcnZlci13VlpMTnEtbHVtcmVGTHYzYmhDMFEzQkQ6";

beforeAll(async () => {
  await user.destroy({ where: {}, force: true });
  await partner.destroy({ where: {}, force: true });
  await transaction.destroy({ where: {}, force: true });
});

// sign up user
describe("Sign Up User", () => {
  describe("/signup POST", () => {
    it("It should get a token from user sign up user", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "test user",
        email: "user@gmail.com",
        password: "User123#",
        confirmPassword: "User123#",
        phone_number: "+62123456789",
        city_or_regional: "indonesia",
        postal_code: 12345,
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
        .attach("ktp_image", "tests/koala.jpg")
        .attach("partner_logo", "tests/koala.jpg");

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

// transaction test
describe("Transaction Test", () => {
  describe("/transaction/ GET", () => {
    it("get all transaction by user - internal server error", async () => {
      const res = await request(app)
        .get("/transaction/")
        .set("Authorization", `bearer ${token}`);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toBeInstanceOf(Object);
    });
    it("get all transaction by user - error no data", async () => {
      const res = await request(app)
        .get("/transaction/")
        .set("Authorization", `bearer ${token}`)
        .query({ order_status: "all", page: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("get all (done) transaction by user - error no data", async () => {
      const res = await request(app)
        .get("/transaction/")
        .set("Authorization", `bearer ${token}`)
        .query({ order_status: "done", page: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("get one transaction by user - error no data", async () => {
      const res = await request(app)
        .get("/transaction/1")
        .set("Authorization", `bearer ${token}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
  });

  describe("/transaction/partner GET", () => {
    it("get all transaction by partner - internal server error", async () => {
      const res = await request(app)
        .get("/transaction/partner")
        .set("Authorization", `bearer ${tokenPartner}`);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toBeInstanceOf(Object);
    });
    it("get all transaction by partner - error no data", async () => {
      const res = await request(app)
        .get("/transaction/partner")
        .set("Authorization", `bearer ${tokenPartner}`)
        .query({ order_status: "all", page: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("get all (done) transaction by partner - error no data", async () => {
      const res = await request(app)
        .get("/transaction/partner")
        .set("Authorization", `bearer ${tokenPartner}`)
        .query({ order_status: "done", page: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("get one transaction by partner - error no data", async () => {
      const res = await request(app)
        .get("/transaction/partner/1")
        .set("Authorization", `bearer ${tokenPartner}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
  });

  describe("/transaction/ POST", () => {
    it("create transaction - internal server error", async () => {
      const res = await request(app)
        .post("/transaction/")
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: 3,
        });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toBeInstanceOf(Object);
    });
    it("create transaction - error (Total item must be a number)", async () => {
      const res = await request(app)
        .post("/transaction/")
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: "A",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Total item must be a number");
    });
    it("create transaction - success", async () => {
      const res = await request(app)
        .post("/transaction/")
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: "3",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");

      idTransaction = await transaction.findOne({
        where: {
          id_partner: idPartner.id,
        },
      });
    });
  });

  describe("/transaction/ GET", () => {
    it("get all transaction by user - success", async () => {
      const res = await request(app)
        .get("/transaction")
        .set("Authorization", `bearer ${token}`)
        .query({ order_status: "all", page: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
    it("get all transaction by user (waiting) - success", async () => {
      const res = await request(app)
        .get("/transaction")
        .set("Authorization", `bearer ${token}`)
        .query({ order_status: "waiting", page: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
    it("get one transaction by user - success", async () => {
      const res = await request(app)
        .get(`/transaction/${idTransaction.id}`)
        .set("Authorization", `bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/transaction/partner GET", () => {
    it("get all transaction by partner - success", async () => {
      const res = await request(app)
        .get("/transaction/partner")
        .set("Authorization", `bearer ${tokenPartner}`)
        .query({ order_status: "all", page: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
    it("get all transaction by partner (waiting)- success", async () => {
      const res = await request(app)
        .get("/transaction/partner")
        .set("Authorization", `bearer ${tokenPartner}`)
        .query({ order_status: "waiting", page: 1 });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
    it("get one transaction by partner - success", async () => {
      const res = await request(app)
        .get(`/transaction/partner/${idTransaction.id}`)
        .set("Authorization", `bearer ${tokenPartner}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/transaction/ PUT", () => {
    it("update transaction - internal server error", async () => {
      const res = await request(app)
        .put(`/transaction/${idTransaction.id}`)
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: 2,
        });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toBeInstanceOf(Object);
    });
    it("update transaction - error (Total item must be a number)", async () => {
      const res = await request(app)
        .put(`/transaction/${idTransaction.id}`)
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: "B",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Total item must be a number");
    });
    it("update transaction - internal server error", async () => {
      const res = await request(app)
        .put(`/transaction/999`)
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: "2",
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("update transaction - success", async () => {
      const res = await request(app)
        .put(`/transaction/${idTransaction.id}`)
        .set("Authorization", `bearer ${token}`)
        .send({
          id_partner: idPartner.id,
          appointment_date: "2021-06-10 10:00:00",
          appointment_address: "Jalan Slompretan No 39, Surabaya",
          total_item: "2",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/transaction/cancel PUT", () => {
    it("cancel transaction - error - data not found", async () => {
      const res = await request(app).put(`/transaction/cancel/999`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("cancel transaction - success", async () => {
      const res = await request(app).put(
        `/transaction/cancel/${idTransaction.id}`
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/transaction/complete PUT", () => {
    it("complete transaction - error - data not found", async () => {
      const res = await request(app).put(`/transaction/complete/999`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
    it("complete transaction - success", async () => {
      const res = await request(app).put(
        `/transaction/complete/${idTransaction.id}`
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });

  describe("/transaction/accept POST", () => {
    it("accept transaction - error - internal server error", async () => {
      const res = await request(app)
        .post(`/transaction/accept/${idTransaction.id}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", `Basic ${midtrans}`);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toBeInstanceOf(Object);
    });
    it("accept transaction - success", async () => {
      const res = await request(app)
        .post(`/transaction/accept/${idTransaction.id}`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .set("Authorization", `Basic ${midtrans}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });
});
