const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");
const askJoeRoute = require("./routes/askJoe");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./Public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./Public/pages/home.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "./Public/pages/menu.html"));
});

app.get("/locations", (req, res) => {
  res.sendFile(path.join(__dirname, "./Public/pages/locations.html"));
});

app.get("/askJoe", (req, res) => {
  res.sendFile(path.join(__dirname, "./Public/pages/askJoe.html"));
});

app.use("/customer", customerRoute);
app.use("/product", productRoute);
app.use("/askJoe", askJoeRoute);

app.listen(3000, () => {
  console.log("Server open on port 3000");
});

