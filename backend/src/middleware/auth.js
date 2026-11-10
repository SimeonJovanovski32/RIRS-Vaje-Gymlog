const User = require('../models/User');

// Zahteva prijavljenega uporabnika. Prebere ga iz seje in ga shrani v req.user
async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ napaka: 'Niste prijavljeni' });
  }

  try {
    const user = await User.findById(req.session.userId);

    // blokiran ali izbrisan uporabnik ne sme več uporabljati aplikacije
    if (!user || user.blokiran) {
      return req.session.destroy(() => {
        res.status(401).json({ napaka: 'Niste prijavljeni' });
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ napaka: 'Napaka strežnika' });
  }
}

// Zahteva eno od navedenih vlog, npr. requireRole('trener', 'admin')
// Vloga se prebere iz baze ob vsaki zahtevi, zato sprememba vloge velja takoj
function requireRole(...vloge) {
  return [
    requireAuth,
    (req, res, next) => {
      if (!vloge.includes(req.user.vloga)) {
        return res.status(403).json({ napaka: 'Nimate pravic za to dejanje' });
      }
      return next();
    },
  ];
}

module.exports = { requireAuth, requireRole };
