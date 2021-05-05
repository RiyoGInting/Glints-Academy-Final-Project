require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const fs = require("fs");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");

//const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Import routes
const userRoutes = require("./routes/userRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const authRoutes = require("./routes/authRoutes");

const categoryRoute = require("./routes/categoryRoute");


//Set body parser for HTTP post operation
app.use(express.json());
app.use(fileUpload());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(fileUpload());

// Sanitize data
//app.use(mongoSanitize());

// Prevent XSS attact
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());
// Use helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // create a write stream (in append mode)
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
      flags: "a",
    }
  );

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
}

app.use(express.static("public"));

// Import table relationship
require("./utils/associations");

// app.use
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/partner", partnerRoutes);
app.use("/category", categoryRoute);


// Server running
app.listen(3000, () => console.log("server running on port 3000"));
