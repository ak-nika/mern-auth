const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("MERN Application with Authentication");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
