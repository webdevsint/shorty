const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const { nanoid } = require("nanoid");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/shorten", (req, res) => {
  const data = require("./data.json");
  const newShort = {
    title: req.body.title || "New Short",
    url: req.body.url,
    code: nanoid(5),
  };

  data.push(newShort);

  fs.writeFile("./data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to data file:", err);
      return res.status(500).send("Internal Server Error");
    }
    
    res.json(newShort);
  });
});

app.get("/shorts", (req, res) => {
  const data = require("./data.json");
    res.json(data);
});

app.get('/:id', (req, res) => {
  const data = require("./data.json");
  const short = data.find(s => s.code === req.params.id);
  
  if (short) {
    res.redirect(short.url);
  } else {
    res.status(404).send("Short not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
