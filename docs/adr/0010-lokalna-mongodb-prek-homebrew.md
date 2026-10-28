# ADR-0010: Lokalna MongoDB prek Homebrew

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Za lokalni razvoj na MacBooku potrebujemo delujočo MongoDB, ki jo je enostavno namestiti in zagnati.

## Obravnavane alternative
- Docker Compose z MongoDB.
- Oblačni MongoDB Atlas.
- MongoDB, nameščena prek Homebrew.

## Sprejeta odločitev in utemeljitev
Izbrana je namestitev prek Homebrew, ker je najpreprostejša na MacBooku. MongoDB Atlas je rezerva, če namestitev ne uspe (zamenja se samo MONGODB_URI).

## Posledice

### Pozitivne
- Hitra namestitev brez Dockerja.
- Atlas kot rezerva brez sprememb kode.

### Negativne
- Namestitev je odvisna od macOS in Homebrew; na drugih sistemih je drugače.
- Okolje ni verzionirano kot pri Docker Compose.
