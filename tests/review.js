module.exports = reviewTest = () => {
  const request = require("supertest"); // Import supertest
  const app = require("../index"); // Import app
  const { user, review, transaction } = require("../models"); // Import user and transaksi models
  const jwt = require("jsonwebtoken");
  const path = require("path");
  let id_transaction;
  let token;
  let partnerToken;
  let id_review;
  let partner_id;
  const reviewData = {
    rating: "3",
    review: "There are 186,860 articles on the Create TEST Wikipedia.",
  };
  const updatedReview = {
    rating: "4",
    review: "There are 186,860 articles on the Update TEST Wikipedia.",
  };
  const userData = {
    email: "stacks@mail.com",
    password: "Test1234.",
  };
  const partnerData = {
    email: "ebit@gmails.com",
    password: "Test123.",
  };
  const userReg = {
    name: "stacks",
    email: "stacks@mail.com",
    password: "Test1234.",
    confirmPassword: "Test1234.",
    phone_number: "+625243534310",
    city_or_regional: "Jakarta",
    postal_code: "43922",
  };
  const partnerReg = {
    name: "Ebit",
    email: "ebit@gmails.com",
    password: "Test123.",
    confirmPassword: "Test123.",
    brand_service_name: "Ebit hardware",
    phone_number: "+6212344501",
    business_phone: "+62123344501",
    business_address: "Jakarta Barat Selatan",
    category_name: "Computer",
    service_fee: "75000",
    ktp_address: "jln. mangga kel buah kec kebun jakarta barat",
    owner_address: "jln. mangga kel buah kec kebun jakarta barat",
  };
  const transData = {
    // id_partner: partner_id,
    appointment_date: "02-02-2021",
    appointment_address: "jl.jalan",
    total_item: "3",
  };
  async function register() {
    const reg = await request(app).post("/auth/signup").send(userReg);
  }
  async function partnerRegister() {
    const partReg = await request(app)
      .post("/auth/signup/partner")
      .field({
        name: "Ebit",
        email: "ebits@gmail.com",
        password: "Test123.",
        confirmPassword: "Test123.",
        brand_service_name: "Ebit hardware",
        phone_number: "+6212174501",
        business_phone: "+6212174501",
        business_address: "Jakarta Barat Selatan",
        category_name: "Computer",
        service_fee: "75900",
        ktp_address: "jln. mangga kel buah kec kebun jakarta barat",
        owner_address: "jln. mangga kel buah kec kebun jakarta barat",
      })
      .attach("ktp_image", "tests/q.jpg")
      .attach("partner_logo", "tests/q.jpg");
  }
  async function login() {
    const resp = await request(app).post("/auth/signin").send(userData);
    return (token = resp.body.token);
  }
  async function partnerLogin() {
    const resp = await request(app)
      .post("/auth/signin/partner")
      .send(partnerData);
    const partnerToken = resp.body.token;
    return partnerToken;
  }
  const nullifyData = async () => {
    await review.destroy({ where: {}, force: true });
  };
  const createReview = async (id_transaction) => {
    const res = await request(app)
      .post(`/review/create?id_transaction=${id_transaction}`)
      .send(reviewData)
      .set({ Authorization: `Bearer ${token}` });
    return res;
  };
  const updateReview = async (id_review) => {
    const res = await request(app)
      .put(`/review/update/${id_review}`)
      .send(updatedReview)
      .set({ Authorization: `Bearer ${token}` });
    return res;
  };
  async function makeTransaction(token, partner_id) {
    // const token = await login();
    const trans = await request(app)
      .post("/transaction")
      .send(transData)
      .send({
        id_partner: partner_id,
      })
      .set({ Authorization: `Bearer ${token}` });
    return (id_transaction = trans.body.data.id);
  }
  ////=======Create Review TEST================////////
  // Create review test
  describe("Create Review Test", () => {
    describe("POST /review/create?id_transaction ", () => {
      it("It should create a review", async () => {
        await partnerRegister();
        const id = await partnerLogin();
        partner_id = jwt.decode(id).partner.id;
        await register();
        token = await login();
        await makeTransaction(token, partner_id);
        await nullifyData();
        const res = await createReview(id_transaction);
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Success");
      });
      it("It should Error 400 alredy reviewed", async () => {
        const res = await createReview(id_transaction);
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("You have reviewed this transaction");
      });
      it("It should Error 400 invalid rating range inpu", async () => {
        await nullifyData();
        const res = await request(app)
          .post(`/review/create?id_transaction=${id_transaction}`)
          .send({
            rating: "7",
            review: reviewData.review,
          })
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(
          "Please insert a number between 0 - 5"
        );
      });
      it("It should Error 400 invalid rating input", async () => {
        await nullifyData();
        const res = await request(app)
          .post(`/review/create?id_transaction=${id_transaction}`)
          .send({
            rating: "e",
            review: reviewData.review,
          })
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Please insert a valid number");
      });
    });
  });
  ////=======Get Review TEST================////////
  // Get one review test
  describe("Get One Review Test", () => {
    describe("GET /review/:review_id ", () => {
      it("It should get one review ", async () => {
        await nullifyData();
        const dataRes = await createReview(id_transaction);
        id_review = dataRes.body.data.id;
        res = await request(app)
          .get(`/review/${id_review}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
      it("It should error data not found ", async () => {
        await nullifyData();
        id_review = 1;
        res = await request(app)
          .get(`/review/${id_review}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });
    });
  });
  ////=======get ALL Test========================////////
  // Get All review by user test(Error data not found)
  describe("Get All Test", () => {
    describe("GET /review/user ", () => {
      it("It should get error data not found", async () => {
        await nullifyData();
        res = await request(app)
          .get(`/review/user`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });
      it("It should get All review from an user", async () => {
        await nullifyData();
        await createReview(id_transaction);
        await makeTransaction(token, partner_id);
        await createReview(id_transaction);
        const res = await request(app)
          .get(`/review/user`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body.resultData.length).toBeGreaterThan(1);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
    });
  });
  // Get All review by partner test (Eroro 404 data not found)
  describe("Get All Test", () => {
    describe("GET /review/partner/:partner_id ", () => {
      it("It should get Error 404", async () => {
        await partnerLogin();
        const id_partner = 7;
        res = await request(app)
          .get(`/review/partner/${id_partner}`)
          .set({ Authorization: `Bearer ${partnerToken}` });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });
      it("It should get All review from a partner", async () => {
        await makeTransaction(token, partner_id);
        await makeTransaction(token, partner_id);
        res = await request(app)
          .get(`/review/partner/${partner_id}`)
          .set({ Authorization: `Bearer ${partnerToken}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body.resultData.length).toBeGreaterThan(1);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
    });
  });
  ////=======Update Review TEST================////////
  // Update review test Success
  describe("Update Review Test", () => {
    describe("PUT /review/update/:review_id ", () => {
      it("It should update review", async () => {
        await nullifyData();
        created = await createReview(id_transaction);
        const id_review = created.body.data.id;
        res = await updateReview(id_review);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
      it("It should Error ID not found", async () => {
        const bad_id_review = 10101010;
        res = await updateReview(bad_id_review);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Review ID not found");
      });
      it("It should Error invalid rating", async () => {
        const id_review = created.body.data.id;
        const res = await request(app)
          .put(`/review/update/${id_review}`)
          .send({ rating: "x", review: updatedReview.review })
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Please insert a valid number");
      });
      it("It should Error invalid range rating", async () => {
        const id_review = created.body.data.id;
        const res = await request(app)
          .put(`/review/update/${id_review}`)
          .send({ rating: "6", review: updatedReview.review })
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual(
          "Please insert a number between 0 - 5"
        );
      });
      it("It should Error empty review", async () => {
        const id_review = created.body.data.id;
        const res = await request(app)
          .put(`/review/update/${id_review}`)
          .send({ rating: updatedReview.rating, review: "" })
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Review cannot be empty");
      });
      it("It should Error ", async () => {
        const id_review = created.body.data.id;
        const res = await request(app)
          .put(`/review/update/${id_review}`)
          .send({ rating: "6", review: "" })
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual(
          "Please insert a number between 0 - 5, Review cannot be empty"
        );
      });
    });
  });
  ////=======Delete Review TEST================////////
  // Delete review test
  describe("Delete Review Test", () => {
    describe("Delete /review/:review_id ", () => {
      it("It should delete a review ", async () => {
        const id_review = created.body.data.id;
        res = await request(app)
          .delete(`/review/${id_review}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
      });
      it("It should error 404  ", async () => {
        const id_review = created.body.data.id;
        res = await request(app)
          .delete(`/review/${id_review + 1}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });
    });
  });
  ////=======Review by Rating Test================////////////////////////////////
  // Get all review by rating test success
  describe("Get review by rating", () => {
    describe("GET /review/filter/byRating ", () => {
      it("It should get all review by rating  ", async () => {
        await nullifyData();
        await createReview(id_transaction);
        await makeTransaction(token, partner_id);
        const created = await createReview(id_transaction);
        await makeTransaction(token, partner_id);
        await request(app)
          .post(`/review/create?id_transaction=${id_transaction}`)
          .send({
            rating: "4",
            review: "There are 186,860 articles on the Create TEST Wikipedia.",
          })
          .set({ Authorization: `Bearer ${token}` });

        const created_partner_id = created.body.data.transaction.id_partner;
        const createdRating = created.body.data.rating;
        res = await request(app).get(
          `/review/filter/byRating?id_partner=${created_partner_id}&rating=${createdRating}`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Success");
        expect(res.body).toHaveProperty("filterdata");
      });
      it("It should error not found  ", async () => {
        res = await request(app).get(
          `/review/filter/byRating?id_partner=${0}&rating=${5}`
        );
        expect(res.statusCode).toEqual(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Data not found");
      });
    });
  });
};
