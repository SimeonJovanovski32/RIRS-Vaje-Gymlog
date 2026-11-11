const express = require('express');
const Nacrt = require('../models/Nacrt');
const Vaja = require('../models/Vaja');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const OBJECT_ID = /^[a-f\d]{24}$/i;

function jeCeloStevilo(v, min, max) {
  return Number.isInteger(v) && v >= min && v <= max;
}

// Sestavljanje načrta: samo trener. Novi načrt je vedno osnutek.
router.post('/', requireRole('trener'), async (req, res) => {
  const { naziv, dnevi } = req.body || {};
  const napake = [];

  if (typeof naziv !== 'string' || !naziv.trim()) {
    napake.push('Naziv načrta je obvezen');
  }

  if (!Array.isArray(dnevi) || dnevi.length === 0) {
    napake.push('Načrt mora imeti vsaj en dan');
  } else {
    dnevi.forEach((dan, i) => {
      const oznakaDne = `Dan ${i + 1}`;
      const postavke = dan && dan.postavke;

      if (!Array.isArray(postavke) || postavke.length === 0) {
        napake.push(`${oznakaDne}: dodajte vsaj eno vajo`);
        return;
      }

      postavke.forEach((p, j) => {
        const oznakaVaje = `${oznakaDne}, vaja ${j + 1}`;
        if (!p || typeof p.vajaId !== 'string' || !OBJECT_ID.test(p.vajaId)) {
          napake.push(`${oznakaVaje}: izberite vajo`);
        }
        if (!p || !jeCeloStevilo(p.serije, 1, 10)) {
          napake.push(`${oznakaVaje}: serije morajo biti od 1 do 10`);
        }
        if (!p || !jeCeloStevilo(p.ponovitve, 1, 50)) {
          napake.push(`${oznakaVaje}: ponovitve morajo biti od 1 do 50`);
        }
      });
    });
  }

  if (napake.length > 0) {
    return res.status(400).json({ napaka: 'Neveljavni podatki', napake });
  }

  try {
    // vse izbrane vaje morajo obstajati v knjižnici
    const idji = [...new Set(dnevi.flatMap((d) => d.postavke.map((p) => p.vajaId)))];
    const obstojece = await Vaja.countDocuments({ _id: { $in: idji } });
    if (obstojece !== idji.length) {
      return res.status(400).json({
        napaka: 'Neveljavni podatki',
        napake: ['Izbrana vaja ne obstaja v knjižnici'],
      });
    }

    const nacrt = await Nacrt.create({
      naziv: naziv.trim(),
      trenerId: req.user._id,
      stanje: 'osnutek',
      dnevi: dnevi.map((dan, i) => ({
        naziv: typeof dan.naziv === 'string' && dan.naziv.trim() ? dan.naziv.trim() : `Dan ${i + 1}`,
        postavke: dan.postavke.map((p) => ({
          vajaId: p.vajaId,
          serije: p.serije,
          ponovitve: p.ponovitve,
        })),
      })),
    });

    return res.status(201).json(nacrt);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

// Seznam načrtov glede na vlogo: trener vidi svoje, član tiste, ki so dodeljeni njemu.
router.get('/', requireAuth, async (req, res) => {
  const { vloga, _id } = req.user;
  let filter;

  if (vloga === 'trener') {
    filter = { trenerId: _id };
  } else if (vloga === 'clan') {
    filter = { clanId: _id };
  } else {
    return res.status(403).json({ napaka: 'Nimate pravic za to dejanje' });
  }

  try {
    const nacrti = await Nacrt.find(filter)
      .sort({ createdAt: -1 })
      .populate('dnevi.postavke.vajaId', 'naziv misicnaSkupina oprema');
    return res.json(nacrti);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});


// Brisanje osnutka: samo trener avtor, samo v stanju osnutek.
router.delete('/:id', requireRole('trener'), async (req, res) => {
  if (!OBJECT_ID.test(req.params.id)) {
    return res.status(404).json({ napaka: 'Načrt ne obstaja' });
  }

  try {
    const nacrt = await Nacrt.findById(req.params.id);
    if (!nacrt) {
      return res.status(404).json({ napaka: 'Načrt ne obstaja' });
    }
    if (!nacrt.trenerId.equals(req.user._id)) {
      return res.status(403).json({ napaka: 'Nimate pravic za to dejanje' });
    }
    if (nacrt.stanje !== 'osnutek') {
      return res.status(409).json({ napaka: 'Izbrisati je mogoče samo osnutek načrta' });
    }

    await nacrt.deleteOne();
    return res.json({ sporocilo: 'Načrt je izbrisan' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});


// Dodelitev načrta članu: samo trener avtor, samo osnutek, samo član, ki ni blokiran.
router.post('/:id/dodeli', requireRole('trener'), async (req, res) => {
  if (!OBJECT_ID.test(req.params.id)) {
    return res.status(404).json({ napaka: 'Načrt ne obstaja' });
  }

  const { clanId } = req.body || {};
  if (typeof clanId !== 'string' || !OBJECT_ID.test(clanId)) {
    return res.status(400).json({ napaka: 'Izberite člana' });
  }

  try {
    const nacrt = await Nacrt.findById(req.params.id);
    if (!nacrt) {
      return res.status(404).json({ napaka: 'Načrt ne obstaja' });
    }
    if (!nacrt.trenerId.equals(req.user._id)) {
      return res.status(403).json({ napaka: 'Nimate pravic za to dejanje' });
    }
    if (nacrt.stanje !== 'osnutek') {
      return res.status(409).json({ napaka: 'Dodeliti je mogoče samo osnutek načrta' });
    }

    const clan = await User.findById(clanId);
    if (!clan || clan.vloga !== 'clan' || clan.blokiran) {
      return res.status(400).json({ napaka: 'Izbran uporabnik ni na voljo kot član' });
    }

    nacrt.clanId = clan._id;
    nacrt.stanje = 'dodeljen';
    await nacrt.save();

    return res.json(nacrt);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

module.exports = router;
