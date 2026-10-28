# ADR-0006: Osebni rekordi se izračunajo ob shranjevanju treninga

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Aplikacija mora zaznati osebne rekorde in jih pokazati v zgodovini. Določiti je treba, kdaj se rekordi izračunajo.

## Obravnavane alternative
- Izračun ob vsakem prikazu zgodovine.
- Izračun ob shranjevanju treninga in shranitev rezultata v trening.
- Ločena zbirka rekordov.

## Sprejeta odločitev in utemeljitev
Izbran je izračun ob shranjevanju. Strežnik za vsako vajo primerja najvišjo težo s prejšnjimi treningi in rezultat shrani v trening, zato pregled zgodovine ne zahteva ponovnega računanja.

## Posledice

### Pozitivne
- Hiter prikaz zgodovine.
- Sporočilo o rekordu je takoj na voljo po shranjevanju.

### Negativne
- Shranjena vrednost je izpeljan podatek.
- Če bi bilo urejanje treningov kasneje dodano, bi bilo treba rekorde preračunati.
