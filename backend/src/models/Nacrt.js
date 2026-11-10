const mongoose = require('mongoose');

const postavkaSchema = new mongoose.Schema(
  {
    vajaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaja', required: true },
    serije: { type: Number, required: true, min: 1, max: 10 },
    ponovitve: { type: Number, required: true, min: 1, max: 50 },
  },
  { _id: false }
);

const danSchema = new mongoose.Schema(
  {
    naziv: { type: String, default: '', trim: true },
    postavke: { type: [postavkaSchema], default: [] },
  },
  { _id: false }
);

const nacrtSchema = new mongoose.Schema(
  {
    naziv: { type: String, required: true, trim: true },
    trenerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    stanje: {
      type: String,
      enum: ['osnutek', 'dodeljen', 'aktiven', 'zakljucen'],
      default: 'osnutek',
    },
    dnevi: { type: [danSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Nacrt', nacrtSchema, 'nacrti');
