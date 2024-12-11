const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");
const askJoeRoute = require("./routes/askJoe");
const mailRoute = require("./routes/mail");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/home.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/menu.html"));
});

app.get("/askJoe", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/askJoe.html"));
});

app.get("/CreateProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/createProfile.html"));
});

app.get("/kurv", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/cart.html"));
});

app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/pages/logout.html"));
});

app.use("/customer", customerRoute);
app.use("/product", productRoute);
app.use("/askJoe", askJoeRoute);
app.use("/mail", mailRoute);

app.listen(3002, () => {
  console.log("Server open on port 3002");
});

