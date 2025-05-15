const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("MERN Application with Authentication");
});

module.exports = app;
