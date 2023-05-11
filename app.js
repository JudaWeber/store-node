const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const debug = require("debug")("bizcard:app");
const cors = require("cors");
const logger = require("./config/winston");
// const helmet = require("helmet");

const apiRouter = require("./routes/api");

const app = express();

app.use(cors());

// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

app.use(morgan("combined", { stream: logger.stream.write }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", apiRouter);
app.use("/api/*", (req, res) => {
  throw new Error("error thrown because of a invalid navigation");
});
app.use((err, req, res, next) => {
  global.logger.error({
    method: req.method,
    error: err.message,
    url: req.originalUrl,
  });
  next(err);
});
/* React*/
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
