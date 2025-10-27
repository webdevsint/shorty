const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const { nanoid } = require("nanoid");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB Atlas
const mongoURI = process.env.CONNECTION_URI;

// 1. Define the Schema for a URL Short
const shortSchema = new mongoose.Schema({
  title: { type: String, default: "New Short" },
  url: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// 2. Create the Model
const Short = mongoose.model("Short", shortSchema);

// 3. Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/shorten", async (req, res) => {
  const { title, url } = req.body;

  if (!url) {
    return res.status(400).send("URL is required.");
  }

  try {
    const newShort = new Short({
      title: title || "New Short",
      url: url,
      code: nanoid(7),
    });

    await newShort.save();

    res.status(201).json(newShort);
  } catch (err) {
    console.error("Error creating and saving short URL:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/shorts", async (req, res) => {
  try {
    const allShorts = await Short.find({});
    res.json(allShorts);
  } catch (err) {
    console.error("Error fetching all shorts:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:id", async (req, res) => {
  const shortCode = req.params.id;

  try {
    const short = await Short.findOne({ code: shortCode });

    if (short) {
      res.redirect(short.url);
    } else {
      res.status(404).send("Short not found");
    }
  } catch (err) {
    console.error("Error finding short code:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
