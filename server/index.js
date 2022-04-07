const express = require("express");
const path = require("path");
const { nanoid } = require("nanoid");
const axios = require("axios");
const validUrl = require("url-validation");

const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
  const id = req.query.id;

  axios
    .get(`http://localhost:5000/?document=short-urls&api_key=${process.env.API_KEY}`)
    .then(function (response) {
      const data = response.data;

      if (data.filter((i) => i.id === id).length > 0) {
        res.redirect(data.filter((i) => i.id === id)[0].url);
      } else if (!id) {
        res.redirect("/shorten");
      } else {
        res.status(400).sendFile(path.resolve("./", "views/", "404.html"));
      }
    })
    .catch((err) => console.log(err));
});

app.get("/shorten", (req, res) => {
  res.sendFile(path.resolve("./", "views/", "index.html"));
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
    res.status(400).sendFile(path.resolve("./", "views/", "invalid.html"));
  } else {
    axios.post(
      `http://localhost:5000/?document=short-urls&api_key=${process.env.API_KEY}`,
      new Payload(req.body.url, id)
    );

    res.send(
      `Short URL: <a href="/?id=${id}">
      http://localhost:5000/?id=${id}
      </a>`
    );
  }
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
