require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const express = require("express");
const app = express();

// Import routes

//Set body parser for HTTP post operation
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

// Import table relationship
require("./utils/associations");

// app.use

// Server running
app.listen(3000, () => console.log("server running on port 3000"));
