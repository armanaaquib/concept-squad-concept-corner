const express = require("express");

const app = express();
app.use(express.static("public"));
app.set("view engine", "pug");
app.listen(8000, () => {
  console.log("8000");
});
app.get("/", (req, res) => {
  users = ["michel", "Joe", "bryce"];
  res.render("index", { users });
  res.end();
});
