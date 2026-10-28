# ADR-0003: Vite proxy za klice API-ja med razvojem

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Frontend in backend med razvojem tečeta na različnih vratih. Brskalnik zaradi tega blokira piškotke in zahteve med različnimi izvori, če jih ne uredimo.

## Obravnavane alternative
- Na backendu nastaviti CORS z dovoljenimi piškotki.
- Vite proxy, ki zahteve na /api posreduje na backend.
- Backend streže zgrajen frontend.

## Sprejeta odločitev in utemeljitev
Izbran je Vite proxy. Brskalnik vidi en sam naslov, piškotek seje deluje brez posebnih nastavitev in CORS ni potreben.

## Posledice

### Pozitivne
- Preprosta nastavitev za razvoj.
- Piškotki delujejo brez dodatnih težav.

### Negativne
- Proxy velja samo za razvoj; pri objavi je treba posebej urediti isti izvor ali CORS.
