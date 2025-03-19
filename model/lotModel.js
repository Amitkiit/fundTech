const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
  lot_id: { type: Number, unique: true, required: true },
  trade_id: {
    type: mongoose.Schema.Types.ObjectId, // This is fine, using ObjectId
    ref: 'Trade',
    required: true
  },
  stock_name: { type: String, required: true },
  lot_quantity: { type: Number, required: true },
  realized_quantity: { type: Number, default: 0 },  
  realized_trade_id: { type: String, default: null },  
  lot_status: { 
    type: String, 
    enum: ['OPEN', 'PARTIALLY REALIZED', 'FULLY REALIZED'],
    default: 'OPEN'
  },
  price_per_unit: { type: Number, required: true }, 
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lot', lotSchema);
