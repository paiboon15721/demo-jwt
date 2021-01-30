const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

const secret = "my super secret token";

app.use(bodyParser.json());

const users = [];

const requireAuth = (req, res, next) => {
  try {
    const { token } = req.query;
    req.user = jwt.verify(token, secret);
    next();
  } catch (e) {
    res.status(401).send("token invalid");
  }
};

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/register", (req, res) => {
  users.push(req.body);
  res.send("register success");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((v) => v.email === email);
  if (!user) {
    res.status(401).send("User not found");
    return;
  }
  if (user.password !== password) {
    // Login failed
    res.status(401).send("Login failed");
    return;
  }

  var token = jwt.sign({ email }, secret);
  res.send({ token });
});

app.get("/profile", requireAuth, (req, res) => {
  const { email } = req.user;
  const user = users.find((v) => v.email === email);
  res.send(user);
});

app.get("/orders", requireAuth, (req, res) => {
  res.send("very secret data")
});

app.listen(3000, () => console.log("Server listen on port: 3000"));
