const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  const { ime, email, geslo } = req.body || {};
  const polja = {};

  if (typeof ime !== 'string' || !ime.trim()) {
    polja.ime = 'Ime je obvezno';
  }

  if (typeof email !== 'string' || !email.trim()) {
    polja.email = 'E-poštni naslov je obvezen';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    polja.email = 'E-poštni naslov ni veljaven';
  }

  if (typeof geslo !== 'string' || !geslo) {
    polja.geslo = 'Geslo je obvezno';
  } else if (geslo.length < 8) {
    polja.geslo = 'Geslo mora imeti vsaj 8 znakov';
  }

  if (Object.keys(polja).length > 0) {
    return res.status(400).json({ napaka: 'Neveljavni podatki', polja });
  }

  try {
    const obstaja = await User.findOne({ email: email.trim().toLowerCase() });
    if (obstaja) {
      return res.status(409).json({ napaka: 'E-poštni naslov je že registriran' });
    }

    const passwordHash = await bcrypt.hash(geslo, 10);
    // vloga je vedno član, ne glede na to, kaj pošlje odjemalec
    const user = await User.create({
      ime: ime.trim(),
      email: email.trim(),
      passwordHash,
      vloga: 'clan',
    });

    return res.status(201).json({
      id: user._id,
      ime: user.ime,
      email: user.email,
      vloga: user.vloga,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ napaka: 'E-poštni naslov je že registriran' });
    }
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

module.exports = router;
