# ADR-0004: MongoDB z Mongoose kot podatkovna baza

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Podatki so v veliki meri hierarhični: načrt vsebuje dneve, dan vsebuje vaje, trening vsebuje vaje s serijami. Izbrati je treba bazo, ki to dobro podpira.

## Obravnavane alternative
- Relacijska baza (PostgreSQL) z osmimi tabelami in ORM (ta možnost je bila resno obravnavana).
- SQLite.
- MongoDB z Mongoose.

## Sprejeta odločitev in utemeljitev
Izbrana je MongoDB z Mongoose. Dokumenti se naravno prilegajo podatkom, za prikaz načrta ali treninga je dovolj ena poizvedba brez združevanj, Mongoose pa doda sheme in validacijo.

## Posledice

### Pozitivne
- Manj tabel in povezav kot pri relacijskem modelu.
- Ena poizvedba za celoten načrt ali trening.
- Sheme in validacija z Mongoose.

### Negativne
- Brez tujih ključev, zato je treba reference preverjati v kodi.
- Poizvedbe čez več treningov (npr. najvišja teža pri vaji) zahtevajo agregacije.
- Lokalna MongoDB brez replike ne podpira transakcij.
