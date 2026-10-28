# 01 – Zasnova rešitve

## Ime rešitve
**GymLog**

## Namen in problem
Obiskovalci telovadnice si treninge pogosto beležijo v zvezek ali pa sploh ne. Zato ne vedo, ali napredujejo, trenerji pa težko spremljajo, ali se stranke držijo dodeljenega načrta vadbe. Načrti se pošiljajo kot slike ali sporočila in se izgubijo.

GymLog to rešuje s preprosto spletno aplikacijo: trener sestavi načrt vadbe in ga dodeli članu, član ga sprejme in po vsakem treningu vnese opravljene vaje (teža, ponovitve), sistem pa samodejno zazna osebne rekorde. Trener vidi treninge svojih članov in jih lahko komentira.

## Ciljni uporabniki
- **Člani** telovadnice, ki želijo slediti načrtu in spremljati napredek.
- **Trenerji**, ki sestavljajo načrte in spremljajo svoje člane.
- **Skrbnik** (vodja telovadnice), ki upravlja uporabnike in knjižnico vaj.

## Primer uporabe
Trener sestavi načrt »Moč za začetnike« s tremi dnevi (prsa/triceps, hrbet/biceps, noge) in ga dodeli članu. Član načrt sprejme. V telovadnici po treningu vnese: bench press, 3 serije, 60 kg × 8 ponovitev. Sistem ugotovi, da je 60 kg nov osebni rekord, in ga označi. Trener pogleda trening in doda komentar »Odlično, naslednjič poskusi 62,5 kg«.

## Kratek opis delovanja
1. Skrbnik vzdržuje knjižnico vaj (naziv, mišična skupina).
2. Trener sestavi načrt (dnevi, vaje, serije, ponovitve) in ga dodeli članu.
3. Član načrt sprejme, s tem postane aktiven.
4. Član po treningu vnese vaje in serije (teža × ponovitve).
5. Sistem samodejno zazna osebne rekorde pri posamezni vaji.
6. Trener pregleda treninge in doda komentar; ko je načrt končan, ga zaključi.