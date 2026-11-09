require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');
const Vaja = require('./models/Vaja');

const vaje = [
  { naziv: 'Bench press', misicnaSkupina: 'prsa', oprema: 'palica', opis: 'Ležeč na klopi spusti palico do prsi in jo potisni navzgor.' },
  { naziv: 'Incline dumbbell press', misicnaSkupina: 'prsa', oprema: 'ročke', opis: 'Potisk ročk na nagnjeni klopi.' },
  { naziv: 'Sklece', misicnaSkupina: 'prsa', oprema: 'lastna teža', opis: 'Potiski telesa od tal z ravnim hrbtom.' },
  { naziv: 'Cable fly', misicnaSkupina: 'prsa', oprema: 'škripec', opis: 'Zapiranje rok pred prsmi s škripcema.' },

  { naziv: 'Mrtvi dvig', misicnaSkupina: 'hrbet', oprema: 'palica', opis: 'Dvig palice s tal do vzravnanega stoječega položaja.' },
  { naziv: 'Zgornji škripec', misicnaSkupina: 'hrbet', oprema: 'škripec', opis: 'Vlek ročaja od zgoraj do prsi.' },
  { naziv: 'Veslanje s ploščo', misicnaSkupina: 'hrbet', oprema: 'naprava', opis: 'Vlek ročajev proti trupu v sedečem položaju.' },
  { naziv: 'Zgibe', misicnaSkupina: 'hrbet', oprema: 'lastna teža', opis: 'Dvig telesa na drogu, dokler brada ne preseže droga.' },

  { naziv: 'Počep', misicnaSkupina: 'noge', oprema: 'palica', opis: 'Počep s palico na ramenih do vzporednega položaja stegen.' },
  { naziv: 'Izpadni korak', misicnaSkupina: 'noge', oprema: 'ročke', opis: 'Korak naprej in spust kolena proti tlom.' },
  { naziv: 'Potisk nog', misicnaSkupina: 'noge', oprema: 'naprava', opis: 'Potisk plošče z nogami na napravi.' },
  { naziv: 'Romunski mrtvi dvig', misicnaSkupina: 'noge', oprema: 'palica', opis: 'Predklon z rahlo pokrčenimi koleni in ravnim hrbtom.' },

  { naziv: 'Potisk čez glavo', misicnaSkupina: 'ramena', oprema: 'palica', opis: 'Potisk palice od ramen nad glavo.' },
  { naziv: 'Bočni dvigi', misicnaSkupina: 'ramena', oprema: 'ročke', opis: 'Dvig ročk v stran do višine ramen.' },
  { naziv: 'Face pull', misicnaSkupina: 'ramena', oprema: 'škripec', opis: 'Vlek vrvi proti obrazu z visokim škripcem.' },

  { naziv: 'Biceps pregib', misicnaSkupina: 'roke', oprema: 'ročke', opis: 'Pregib komolcev z ročkami.' },
  { naziv: 'Triceps potisk', misicnaSkupina: 'roke', oprema: 'škripec', opis: 'Potisk ročaja navzdol z iztegom komolcev.' },
  { naziv: 'Kladivni pregib', misicnaSkupina: 'roke', oprema: 'ročke', opis: 'Pregib komolcev z nevtralnim prijemom.' },

  { naziv: 'Plank', misicnaSkupina: 'trebuh', oprema: 'lastna teža', opis: 'Držanje ravnega telesa na podlakteh.' },
  { naziv: 'Dvigi nog', misicnaSkupina: 'trebuh', oprema: 'lastna teža', opis: 'Dvig iztegnjenih nog v ležečem položaju.' },
  { naziv: 'Trebušnjaki', misicnaSkupina: 'trebuh', oprema: 'lastna teža', opis: 'Dvig zgornjega dela trupa iz ležečega položaja.' },
];

const testniUporabniki = [
  { email: 'admin@gymlog.si', ime: 'Admin', vloga: 'admin' },
  { email: 'trener@gymlog.si', ime: 'Trener Test', vloga: 'trener' },
  { email: 'clan@gymlog.si', ime: 'Član Test', vloga: 'clan' },
];

const TESTNO_GESLO = 'Geslo123!';

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Manjka MONGODB_URI v datoteki .env');
    process.exit(1);
  }

  await connectDB(process.env.MONGODB_URI);

  await Vaja.deleteMany({});
  await Vaja.insertMany(vaje);

  await User.deleteMany({ email: { $in: testniUporabniki.map((u) => u.email) } });
  const passwordHash = await bcrypt.hash(TESTNO_GESLO, 10);
  await User.insertMany(testniUporabniki.map((u) => ({ ...u, passwordHash })));

  console.log(`Vaje v bazi: ${await Vaja.countDocuments()}`);
  console.log(`Testni uporabniki: ${testniUporabniki.map((u) => u.email).join(', ')}`);
  console.log(`Testno geslo: ${TESTNO_GESLO}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
