const express = require('express');
const User = require('../models/User');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Seznam članov, ki niso blokirani. Samo trener, vrne samo potrebne podatke.
router.get('/', requireRole('trener'), async (req, res) => {
  try {
    const clani = await User.find({ vloga: 'clan', blokiran: false })
      .select('ime email')
      .sort({ ime: 1 });
    return res.json(clani);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
});

module.exports = router;
