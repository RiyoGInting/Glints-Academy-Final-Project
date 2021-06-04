const reviewTest = require("./review");
const userTest = require("./user");
const transactionTest = require("./transaction");
const blogTest = require("./blog");
const categoryTest = require("./category");

describe("User Test", userTest);
describe("Category Test", categoryTest);
describe("Transaction Test", transactionTest);
describe("ReviewTest ", reviewTest);
describe("Blog Test", blogTest);
