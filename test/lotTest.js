const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../index'); // Import your express app
const Lot = require('../model/lotModel');
const { expect } = chai;

chai.use(chaiHttp);

describe('Lot Management Tests', () => {
  before(async () => {
    const db = await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for testing!');
  });
  beforeEach(async () => {
    await Lot.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe('FIFO Logic', () => {
    it('should return lots sorted by the oldest first (FIFO)', async () => {
      const lot1 = new Lot({
        trade_id: mongoose.Types.ObjectId(),
        stock_name: 'AAPL',
        lot_quantity: 50,
        realized_quantity: 0,
        lot_status: 'OPEN',
        price_per_unit: 100,
      });
      await lot1.save();

      const lot2 = new Lot({
        trade_id: mongoose.Types.ObjectId(),
        stock_name: 'AAPL',
        lot_quantity: 30,
        realized_quantity: 0,
        lot_status: 'OPEN',
        price_per_unit: 110,
      });
      await lot2.save();
      const lots = await Lot.find().sort({ _id: 1 });
      expect(lots[0]._id.toString()).to.equal(lot1._id.toString());
      expect(lots[1]._id.toString()).to.equal(lot2._id.toString());
    });
  });

  describe('LIFO Logic', () => {
    it('should return lots sorted by the newest first (LIFO)', async () => {
      const lot1 = new Lot({
        trade_id: mongoose.Types.ObjectId(),
        stock_name: 'GOOG',
        lot_quantity: 100,
        realized_quantity: 0,
        lot_status: 'OPEN',
        price_per_unit: 1500,
      });
      await lot1.save();

      const lot2 = new Lot({
        trade_id: mongoose.Types.ObjectId(),
        stock_name: 'GOOG',
        lot_quantity: 40,
        realized_quantity: 0,
        lot_status: 'OPEN',
        price_per_unit: 1600,
      });
      await lot2.save();
      const lots = await Lot.find().sort({ _id: -1 });
      expect(lots[0]._id.toString()).to.equal(lot2._id.toString());
      expect(lots[1]._id.toString()).to.equal(lot1._id.toString());
    });
  });
});
