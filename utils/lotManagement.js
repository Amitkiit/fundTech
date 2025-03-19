const Lot = require("../model/lotModel");
const Trade = require("../model/tradeModel");

const Lot = require("../model/lotModel");
const Trade = require("../model/tradeModel");

const handleLotManagement = async (stock_name, trade) => {
  const { quantity } = trade;

  if (quantity > 0) {
    const newLot = new Lot({
      trade_id: trade._id, // Ensure this is an ObjectId
      lot_quantity: quantity,
      stock_name,
      lot_status: "OPEN",
      price_per_unit: trade.price, // Assuming price is used as price_per_unit
    });
    await newLot.save();
  } else {
    let remainingQuantity = Math.abs(quantity);
    const lots = await Lot.find({ stock_name, lot_status: "OPEN" }).sort({ _id: 1 });

    for (let lot of lots) {
      if (remainingQuantity <= 0) break;

      const lotToSell = Math.min(remainingQuantity, lot.lot_quantity - lot.realized_quantity);
      lot.realized_quantity += lotToSell;
      remainingQuantity -= lotToSell;

      if (lot.lot_quantity === lot.realized_quantity) {
        lot.lot_status = "FULLY REALIZED";
      } else {
        lot.lot_status = "PARTIALLY REALIZED";
      }

      lot.realized_trade_id = trade._id; // Ensure this is correct
      await lot.save();
    }

    if (remainingQuantity > 0) {
      throw new Error("Not enough stock in lots to fulfill reverse trade");
    }
  }
};


const handleReverseTrade = async (stock_name, quantity, broker_name, price) => {
    let remainingQuantity = Math.abs(quantity);
    const lots = await Lot.find({ stock_name, lot_status: "OPEN" }).sort({ _id: 1 });
  
    for (let lot of lots) {
      if (remainingQuantity <= 0) break;
  
      const lotToReverse = Math.min(remainingQuantity, lot.lot_quantity - lot.realized_quantity);
      lot.realized_quantity -= lotToReverse;
      remainingQuantity -= lotToReverse;
  
      if (lot.realized_quantity === 0) {
        lot.lot_status = "OPEN";
      } else {
        lot.lot_status = "PARTIALLY REALIZED";
      }
  
      await lot.save();
    }
  
    if (remainingQuantity > 0) {
      throw new Error("Not enough stock in lots to reverse the trade");
    }
  };
  

module.exports = { handleLotManagement, handleReverseTrade }
