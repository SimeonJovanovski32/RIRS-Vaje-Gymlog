const mongoose = require('mongoose');

const serijaSchema = new mongoose.Schema(
  {
    teza: { type: Number, required: true, min: 0.01, max: 500 },
    ponovitve: { type: Number, required: true, min: 1, max: 100 },
  },
  { _id: false }
);

const zapisSchema = new mongoose.Schema(
  {
    vajaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaja', required: true },
    serije: { type: [serijaSchema], default: [] },
  },
  { _id: false }
);

const rekordSchema = new mongoose.Schema(
  {
    vajaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaja', required: true },
    teza: { type: Number, required: true },
  },
  { _id: false }
);

const treningSchema = new mongoose.Schema(
  {
    clanId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nacrtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nacrt', default: null },
    datum: { type: Date, required: true },
    zapisi: { type: [zapisSchema], default: [] },
    // izpolni US-08 (zaznavanje rekordov)
    rekordi: { type: [rekordSchema], default: [] },
    komentarTrenerja: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trening', treningSchema, 'treningi');
