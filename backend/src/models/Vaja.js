const mongoose = require('mongoose');

const vajaSchema = new mongoose.Schema(
  {
    naziv: { type: String, required: true, unique: true, trim: true },
    misicnaSkupina: {
      type: String,
      required: true,
      enum: ['prsa', 'hrbet', 'noge', 'ramena', 'roke', 'trebuh'],
    },
    oprema: { type: String, required: true, trim: true },
    opis: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vaja', vajaSchema, 'vaje');
