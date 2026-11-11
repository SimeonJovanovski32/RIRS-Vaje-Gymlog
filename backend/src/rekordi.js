const Trening = require('./models/Trening');

// Najvišja teža v enem zapisu (vaji) treninga.
function najvisjaTeza(zapis) {
  return Math.max(...zapis.serije.map((s) => s.teza));
}

// Za vsako vajo v novem treningu primerja najvišjo težo z najvišjo težo iste vaje
// v prejšnjih treningih istega člana. Vrne seznam rekordov { vajaId, teza }.
// Prvi vnos vaje je izhodišče in ni rekord, enaka teža ni rekord.
async function zaznajRekorde({ clanId, zapisi, datum }) {
  // najvišja teža v tem treningu po vaji (če je ista vaja vnesena večkrat)
  const trenutne = new Map();
  for (const zapis of zapisi) {
    const id = String(zapis.vajaId);
    const teza = najvisjaTeza(zapis);
    if (!trenutne.has(id) || teza > trenutne.get(id)) {
      trenutne.set(id, teza);
    }
  }

  // prejšnji treningi istega člana (brez trenutnega, ki še ni shranjen)
  const prejsnji = await Trening.find({ clanId, datum: { $lte: datum } }).select('zapisi');

  const prejsnjeNajvisje = new Map();
  for (const t of prejsnji) {
    for (const z of t.zapisi) {
      if (!z.serije || z.serije.length === 0) continue;
      const id = String(z.vajaId);
      const teza = najvisjaTeza(z);
      if (!prejsnjeNajvisje.has(id) || teza > prejsnjeNajvisje.get(id)) {
        prejsnjeNajvisje.set(id, teza);
      }
    }
  }

  const rekordi = [];
  for (const [vajaId, teza] of trenutne) {
    // prvi vnos: ni prejšnjih podatkov, zato ni rekorda
    if (!prejsnjeNajvisje.has(vajaId)) continue;
    // rekord samo, če je teža višja od prejšnje najvišje
    if (teza > prejsnjeNajvisje.get(vajaId)) {
      rekordi.push({ vajaId, teza });
    }
  }
  return rekordi;
}

module.exports = { zaznajRekorde };
