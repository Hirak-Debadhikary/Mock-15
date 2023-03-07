const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./Route/authRoutes");

require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("Hello world"));
app.use("/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
