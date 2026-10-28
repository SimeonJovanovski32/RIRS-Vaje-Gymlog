# GymLog

GymLog je spletna aplikacija za spremljanje treningov v telovadnici. Trener sestavi načrt vadbe in ga dodeli članu, član načrt sprejme in po treningu vnese vaje (teža in ponovitve), aplikacija pa samodejno zazna osebne rekorde. Trener vidi treninge svojih članov in jih lahko komentira, skrbnik upravlja uporabnike in knjižnico vaj.

Uporabniške vloge: član, trener, skrbnik.

## Tehnologije

- Frontend: React, Vite, React Router
- Backend: Node.js, Express (REST API, JSON)
- Podatkovna baza: MongoDB, Mongoose
- Avtentikacija: express-session, connect-mongo, bcryptjs
- Lokalni razvoj: macOS, Homebrew, npm

## Dokumentacija

Vsa dokumentacija je v mapi [docs/](docs/):

- [01 – Zasnova rešitve](docs/01-zasnova-resitve.md)
- [02 – Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [03 – Podatkovni model](docs/03-podatkovni-model.md)
- [04 – Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [05 – Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [06 – Wireframes](docs/06-wireframes.md)
- [Arhitekturne odločitve (ADR)](docs/adr/)

## Struktura repozitorija

```
README.md
.gitignore
frontend/   (React aplikacija, še prazno)
backend/    (Express API, še prazno)
docs/       (dokumentacija, wireframes/, adr/)
```

## Zagon

Postopek lokalnega zagona je opisan v [docs/04-arhitektura-in-tehnoloski-sklad.md](docs/04-arhitektura-in-tehnoloski-sklad.md). Frontend in backend bosta dodana pri vajah.

## Razvojni proces

Razvoj poteka po strategiji GitHub Flow: veja `main` je zaščitena, spremembe pridejo vanjo samo prek pull requestov iz razvojnih vej.
