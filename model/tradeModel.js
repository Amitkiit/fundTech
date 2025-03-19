const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  trade_id: { type: mongoose.Schema.Types.ObjectId, unique: true, required: true }, // Change to ObjectId
  stock_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  broker_name: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trade", tradeSchema);

