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

router.post('/login', async (req, res) => {
  const { email, geslo } = req.body || {};
  const NAPACNI_PODATKI = 'Napačen e-poštni naslov ali geslo';

  if (typeof email !== 'string' || typeof geslo !== 'string' || !email || !geslo) {
    return res.status(401).json({ napaka: NAPACNI_PODATKI });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // isto sporočilo za neobstoječ račun in napačno geslo
    if (!user) {
      return res.status(401).json({ napaka: NAPACNI_PODATKI });
    }

    const geslo_ok = await bcrypt.compare(geslo, user.passwordHash);
    if (!geslo_ok) {
      return res.status(401).json({ napaka: NAPACNI_PODATKI });
    }

    if (user.blokiran) {
      return res.status(403).json({ napaka: 'Račun je blokiran' });
    }

    // nova seja ob prijavi, da se prepreči prevzem stare seje
    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ napaka: 'Napaka strežnika' });
      }
      req.session.userId = user._id.toString();
      req.session.save((err2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ napaka: 'Napaka strežnika' });
        }
        return res.json({
          id: user._id,
          ime: user.ime,
          email: user.email,
          vloga: user.vloga,
        });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ napaka: 'Napaka strežnika' });
    }
    res.clearCookie('connect.sid');
    return res.json({ sporocilo: 'Odjavljen' });
  });
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ napaka: 'Niste prijavljeni' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.blokiran) {
      req.session.destroy(() => {});
      return res.status(401).json({ napaka: 'Niste prijavljeni' });
    }
    return res.json({
      id: user._id,
      ime: user.ime,
      email: user.email,
      vloga: user.vloga,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

module.exports = router;
