const request = require("supertest"); // Import supertest
const app = require("../index"); // Import app
const { user, review } = require("../models"); // Import user and transaksi models
let id_transaction = 1;
const reviewData = {
  rating: "3",
  review: "There are 186,860 articles on the Create TEST Wikipedia.",
};
const updatedReview = {
  rating: "4",
  review: "There are 186,860 articles on the Update TEST Wikipedia.",
};
const userData = {
  email: "stack@mail.com",
  password: "Test1234.",
};
const partnerData = {
  email: "ebit@gmail.com",
  password: "Test123.",
};
async function login() {
  const resp = await request(app).post("/auth/signin").send(userData);
  return (token = resp.body.token);
}
async function partnerLogin() {
  const resp = await request(app)
    .post("/auth/signin/partner")
    .send(partnerData);
  return (partnerToken = resp.body.token);
}
const nullifyData = async () => {
  await review.destroy({ where: {}, force: true });
};
const createReview = async () => {
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
////=======Create Review TEST================////////
// Create review test
describe("Create Review Test", () => {
  describe("POST /review/create?id_transaction ", () => {
    it("It should create a review", async () => {
      await login();
      await nullifyData();
      //   await review.destroy({ where: {}, force: true });
      const res = await createReview();
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual("Success");
    });
  });
});
//Create Review Error 400 (duplicate review)
describe("Create Review Test", () => {
  describe("POST /review/create?id_transaction ", () => {
    it("It should Error", async () => {
      res = await createReview();
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("You have reviewed this transaction");
    });
  });
});

//Create Review Error 400 (invalid rating)
describe("Create Review Test", () => {
  describe("POST /review/create?id_transaction ", () => {
    it("It should Error", async () => {
      await login();
      await nullifyData();
      const res = await request(app)
        .post(`/review/create?id_transaction=${id_transaction}`)
        .send({
          rating: "7",
          review: reviewData.review,
        })
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Please insert a number between 0 - 5");
    });
  });
});
//Create Review Error 400 (invalid rating for non number)
describe("Create Review Test", () => {
  describe("POST /review/create?id_transaction ", () => {
    it("It should Error", async () => {
      await login();
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
describe("Get One Test", () => {
  describe("GET /review/:review_id ", () => {
    it("It should get one review ", async () => {
      await login();
      await nullifyData();
      const created = await createReview();
      const id_review = created.body.data.id;
      res = await request(app)
        .get(`/review/${id_review}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Object);
      expect(res.body.data.id).toEqual(id_review);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.review).toEqual(created.body.data.review);
      expect(res.body.message).toEqual("Success");
    });
  });
});
// Get one review test data not found
describe("Get One Test", () => {
  describe("GET /review/:review_id ", () => {
    it("It should error data not found ", async () => {
      await nullifyData();
      const id_review = 1;
      res = await request(app)
        .get(`/review/${id_review}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
  });
});
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
  });
});
// Get All review by user test
describe("Get All Test", () => {
  describe("GET /review/user ", () => {
    it("It should get All review from an user", async () => {
      await login();
      await nullifyData();
      const data1 = await createReview();
      const data2 = await request(app)
        .post(`/review/create?id_transaction=${id_transaction + 1}`)
        .send(updatedReview)
        .set({ Authorization: `Bearer ${token}` });
      const res = await request(app)
        .get(`/review/user`)
        .set({ Authorization: `Bearer ${token}` });
      console.log(res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.resultData.length).toBeGreaterThan(0);
      expect(res.body.resultData[0].id).toEqual(data1.body.data.id);
      expect(res.body.resultData[1].id).toEqual(data2.body.data.id);
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
      await nullifyData();
      res = await request(app)
        .get(`/review/partner/${id_partner}`)
        .set({ Authorization: `Bearer ${partnerToken}` });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Data not found");
    });
  });
});
// Get All review by partner test
describe("Get All Test", () => {
  describe("GET /review/partner/:partner_id ", () => {
    it("It should get All review from a partner", async () => {
      // await partnerLogin();
      await nullifyData();
      const data1 = await createReview();
      const data2 = await request(app)
        .post(`/review/create?id_transaction=${id_transaction + 1}`)
        .send(updatedReview)
        .set({ Authorization: `Bearer ${token}` });
      const id_partner = data1.body.data.transaction.id_partner;
      res = await request(app)
        .get(`/review/partner/${id_partner}`)
        .set({ Authorization: `Bearer ${partnerToken}` });
      expect(res.statusCode).toEqual(200);
      expect(res.body.resultData.length).toBeGreaterThan(0);
      expect(res.body).toBeInstanceOf(Object);
      expect(
        res.body.resultData[0].transaction.id_partner &&
          res.body.resultData[1].transaction.id_partner &&
          data1.body.data.transaction.id_partner &&
          data2.body.data.transaction.id_partner
      ).toBeTruthy();
      expect(res.body.message).toEqual("Success");
    });
  });
});
////=======Update Review TEST================////////
// Update review test Success
describe("Update Review Test", () => {
  describe("PUT /review/update/:review_id ", () => {
    it("It should update review", async () => {
      await login();
      await nullifyData();
      created = await createReview();
      const id_review = created.body.data.id;
      res = await updateReview(id_review);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });
});
// Update review test (invalid review ID)
describe("Update Review Test", () => {
  describe("PUT /review/update/:review_id ", () => {
    it("It should Error", async () => {
      //   await login();
      const bad_id_review = 10101010;
      res = await updateReview(bad_id_review);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Review ID not found");
    });
  });
});

// Update review test (invalid rating for non number)
describe("Update Review Test", () => {
  describe("PUT /review/update/:review_id ", () => {
    it("It should Error", async () => {
      //   await login();
      //   console.log(created);
      const id_review = created.body.data.id;
      const res = await request(app)
        .put(`/review/update/${id_review}`)
        .send({ rating: "x", review: updatedReview.review })
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please insert a valid number");
    });
  });
});
// Update review test (invalid rating for ,<0 or >5)
describe("Update Review Test", () => {
  describe("PUT /review/update/:review_id ", () => {
    it("It should Error ", async () => {
      //   await login();
      //   console.log(created);
      const id_review = created.body.data.id;
      const res = await request(app)
        .put(`/review/update/${id_review}`)
        .send({ rating: "6", review: updatedReview.review })
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please insert a number between 0 - 5");
    });
  });
});
// Update review test (empty review)
describe("Update Review Test", () => {
  describe("PUT /review/update/:review_id ", () => {
    it("It should Error ", async () => {
      //   await login();
      //   console.log(created);
      const id_review = created.body.data.id;
      const res = await request(app)
        .put(`/review/update/${id_review}`)
        .send({ rating: updatedReview.rating, review: "" })
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Review cannot be empty");
    });
  });
});
// Update review test (empty review and invalid number rating)
describe("Update Review Test", () => {
  describe("PUT /review/update/:review_id ", () => {
    it("It should Error ", async () => {
      //   await login();
      //   console.log(created);
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
  });
});
// Delete review test (data not found)
describe("Delete Review Test", () => {
  describe("Delete /review/:review_id ", () => {
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
////=======Review averageRating Test================////////////////////////////////
// Get oaverage rating test data not found
describe("Get average rating", () => {
  describe("GET /review/:review_id ", () => {
    it("It should get rating and star's details  ", async () => {
      await nullifyData();
      const created = await createReview();
      const id_partner = created.body.data.transaction.id_partner;
      res = await request(app).get(`/review/averageRating/${id_partner}`);
      // .set({ Authorization: `Bearer ${partnerToken}` });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(typeof parseInt(res.body.averageRating)).toBe("number");
      expect(res.body.message).toEqual("Success");
    });
  });
});
