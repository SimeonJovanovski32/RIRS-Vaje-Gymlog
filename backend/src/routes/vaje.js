const express = require('express');
const mongoose = require('mongoose');
const Vaja = require('../models/Vaja');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const SKUPINE = ['prsa', 'hrbet', 'noge', 'ramena', 'roke', 'trebuh'];

// Seznam vaj, neobvezen filter: /api/vaje?misicnaSkupina=prsa
router.get('/', requireAuth, async (req, res) => {
  const { misicnaSkupina } = req.query;
  const filter = {};

  if (misicnaSkupina !== undefined && misicnaSkupina !== '') {
    if (!SKUPINE.includes(misicnaSkupina)) {
      return res.status(400).json({ napaka: 'Neveljavna mišična skupina' });
    }
    filter.misicnaSkupina = misicnaSkupina;
  }

  try {
    const vaje = await Vaja.find(filter).sort({ misicnaSkupina: 1, naziv: 1 });
    return res.json(vaje);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

// Ena vaja z opisom izvedbe
router.get('/:id', requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ napaka: 'Vaja ne obstaja' });
  }

  try {
    const vaja = await Vaja.findById(req.params.id);
    if (!vaja) {
      return res.status(404).json({ napaka: 'Vaja ne obstaja' });
    }
    return res.json(vaja);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

module.exports = router;
