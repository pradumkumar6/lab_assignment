const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./init/db"); // Import connectDB function
const dishesData = require("./init/data");
const Dish = require("./models/Dish");

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

// Fetch all dishes
app.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.render("dashboard", { dishes }); // Render EJS template with dishes data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Populate initial data
app.post("/api/dishes/populate", async (req, res) => {
  try {
    await Dish.deleteMany({}); // Optional: Clear existing data before populating
    await Dish.insertMany(dishesData);
    res.status(201).json({ message: "Data populated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle isPublished status
app.post("/api/dishes/:id/toggle", async (req, res) => {
  try {
    const dish = await Dish.findOne({ dishId: req.params.id });
    dish.isPublished = !dish.isPublished;
    await dish.save();
    res.redirect("/"); // Redirect to dashboard after toggling
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
