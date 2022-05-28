const express = require("express");
const { nanoid } = require("nanoid");
const axios = require("axios");
const validUrl = require("url-validation");

const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
  const id = req.query.id;

  axios
    .get(
      process.env.API
    )
    .then(function (response) {
      const data = response.data;

      if (data.filter((i) => i.id === id).length > 0) {
        res.redirect(data.filter((i) => i.id === id)[0].url);
      } else if (!id) {
        res.redirect("/shorten");
      } else {
        res.status(400).render("404");
      }
    })
    .catch((err) => console.log(err));
});

app.get("/shorten", (req, res) => {
  res.render("index");
});

app.post("/shorten", (req, res) => {
  const id = nanoid(8);

  class Payload {
    constructor(url, id) {
      this.url = url;
      this.id = id;
    }
  }

  if (!validUrl(req.body.url)) {
    res.status(400).render("invalid");
  } else {
    axios.post(
      process.env.API,
      new Payload(req.body.url, id)
    );

    res.render("success", { id: id });
  }
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
