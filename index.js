const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
// const { apiRateLimiter } = require("./middleware/rateLimitter");
const rateLimit = require("express-rate-limit");
const {errorHandler}= require("./middleware/errorHandler")
const dotenv = require("dotenv")
const app = express();
app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false, 
  });
const cors = require("cors")
// app.use(limiter);
const bodyParser= require('body-parser')
dotenv.config();
app.use(cors());
// app.use(apiRateLimiter);
mongoose.set("strictQuery", true);

mongoose
  .connect("MONGODB_URI=mongodb://localhost:27017/stock-trading-portal", {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => console.log(err));
app.use("/", route);
app.get("/", (req, res) => {
  res.send("Welcome to the stock trade API!");
});
// app.use(errorHandler);

app.listen(3000, function () {
  console.log("Express app running on port 3000");
});



