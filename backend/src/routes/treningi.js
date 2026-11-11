const express = require('express');
const Trening = require('../models/Trening');
const Nacrt = require('../models/Nacrt');
const Vaja = require('../models/Vaja');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const OBJECT_ID = /^[a-f\d]{24}$/i;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;

// Vnos treninga: samo član. Trening je vedno last člana, ki ga vnese.
router.post('/', requireRole('clan'), async (req, res) => {
  const { datum, nacrtId, zapisi } = req.body || {};
  const napake = [];

  let datumVrednost = null;
  if (typeof datum !== 'string' || !DATUM.test(datum) || Number.isNaN(Date.parse(datum))) {
    napake.push('Datum je obvezen in mora biti veljaven');
  } else {
    datumVrednost = new Date(`${datum}T12:00:00.000Z`);
  }

  if (!Array.isArray(zapisi) || zapisi.length === 0) {
    napake.push('Trening mora imeti vsaj eno vajo');
  } else {
    zapisi.forEach((z, i) => {
      const oznakaVaje = `Vaja ${i + 1}`;
      if (!z || typeof z.vajaId !== 'string' || !OBJECT_ID.test(z.vajaId)) {
        napake.push(`${oznakaVaje}: izberite vajo`);
      }
      if (!z || !Array.isArray(z.serije) || z.serije.length === 0) {
        napake.push(`${oznakaVaje}: dodajte vsaj eno serijo`);
        return;
      }
      z.serije.forEach((s, j) => {
        const oznakaSerije = `${oznakaVaje}, serija ${j + 1}`;
        if (!s || typeof s.teza !== 'number' || !(s.teza > 0 && s.teza <= 500)) {
          napake.push(`${oznakaSerije}: teža mora biti večja od 0 in največ 500 kg`);
        }
        if (!s || !Number.isInteger(s.ponovitve) || s.ponovitve < 1 || s.ponovitve > 100) {
          napake.push(`${oznakaSerije}: ponovitve morajo biti od 1 do 100`);
        }
      });
    });
  }

  if (nacrtId !== undefined && nacrtId !== null && nacrtId !== '') {
    if (typeof nacrtId !== 'string' || !OBJECT_ID.test(nacrtId)) {
      napake.push('Načrt ni veljaven');
    }
  }

  if (napake.length > 0) {
    return res.status(400).json({ napaka: 'Neveljavni podatki', napake });
  }

  try {
    // vse izbrane vaje morajo obstajati v knjižnici
    const idji = [...new Set(zapisi.map((z) => z.vajaId))];
    const obstojece = await Vaja.countDocuments({ _id: { $in: idji } });
    if (obstojece !== idji.length) {
      return res.status(400).json({
        napaka: 'Neveljavni podatki',
        napake: ['Izbrana vaja ne obstaja v knjižnici'],
      });
    }

    // povezava z načrtom: samo lasten, aktiven načrt
    let nacrtVrednost = null;
    if (nacrtId) {
      const nacrt = await Nacrt.findById(nacrtId);
      if (!nacrt || !nacrt.clanId || !nacrt.clanId.equals(req.user._id)) {
        return res.status(403).json({ napaka: 'Nimate pravic za to dejanje' });
      }
      if (nacrt.stanje !== 'aktiven') {
        return res.status(409).json({
          napaka: 'Trening je mogoče povezati samo z aktivnim načrtom',
        });
      }
      nacrtVrednost = nacrt._id;
    }

    const trening = await Trening.create({
      clanId: req.user._id,
      nacrtId: nacrtVrednost,
      datum: datumVrednost,
      zapisi: zapisi.map((z) => ({
        vajaId: z.vajaId,
        serije: z.serije.map((s) => ({ teza: s.teza, ponovitve: s.ponovitve })),
      })),
    });

    return res.status(201).json(trening);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

// Seznam treningov: član vidi samo svoje, najnovejše na vrhu.
router.get('/', requireRole('clan'), async (req, res) => {
  try {
    const treningi = await Trening.find({ clanId: req.user._id })
      .sort({ datum: -1, createdAt: -1 })
      .populate('zapisi.vajaId', 'naziv misicnaSkupina')
      .populate('nacrtId', 'naziv');
    return res.json(treningi);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

module.exports = router;
