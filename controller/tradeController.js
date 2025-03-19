const express = require("express")
const Trade = require("../model/tradeModel")
const Lot = require("../model/lotModel")
const { validateTrade } = require("../validators/tradeValidator")
const { handleLotManagement, handleReverseTrade }= require("../utils/lotManagement")

const tradeCreation = async (req, res) => {
  const { error } = validateTrade(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const { stock_name, quantity, broker_name, price } = req.body
  const amount = price * quantity

  try {
    const trade = new Trade({
      stock_name,
      quantity,
      broker_name,
      price,
      amount,
    });

    await trade.save()

    await handleLotManagement(stock_name, trade)

    res.status(201).json(trade)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
};

const fetchAllTrade = async (req, res) => {
  try {
    const trades = await Trade.find()
    res.status(200).json(trades)
  } catch (error) {
    res.status(500).json({ message: "Error fetching trades", error })
  }
};

const fifoTrade = async (req, res) => {
  try {
    const lots = await Lot.find().sort({ _id: 1 })
    res.status(200).json(lots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FIFO lots", error })
  }
};
const lifoTrade = async (req, res) => {
  try {
    const lots = await Lot.find().sort({ _id: -1 })
    res.status(200).json(lots)
  } catch (error) {
    res.status(500).json({ message: "Error fetching LIFO lots", error })
  }
};

const reverseTrade = async (req, res) => {
    const { stock_name, quantity, broker_name, price } = req.body;
  
    try {
      const trade = await Trade.findOne({ stock_name, broker_name, price });
      if (!trade) {
        return res.status(400).json({ message: 'No matching trade found for reverse.' });
      }
      await handleReverseTrade(stock_name, quantity, broker_name, price);
  
      res.status(200).json({ message: 'Reverse trade handled successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error processing reverse trade', error: error.message });
    }
  };
  
module.exports = { tradeCreation, fetchAllTrade, fifoTrade, lifoTrade,reverseTrade }