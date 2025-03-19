const express = require("express");
const router = express.Router();
const Trade = require("../model/tradeModel");
const Lot = require("../model/lotModel");
const authMiddleware = require("../middleware/authMiddleware");
const {
  tradeCreation,
  fetchAllTrade,
  lifoTrade,
  fifoTrade,
  reverseTrade,
} = require("../controller/tradeController");

router.post("/createTrade", authMiddleware, tradeCreation);
router.get("/fetchTrade", authMiddleware, fetchAllTrade);
router.get("/fifo", authMiddleware, fifoTrade);
router.get("/lifo", authMiddleware, lifoTrade);
router.post("/reverse", authMiddleware, reverseTrade);
module.exports = router;
