# ADR-0009: bcryptjs za zgostitev gesel

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Gesla ne smejo biti shranjena kot navaden tekst. Izbrati je treba knjižnico za zgostitev, ki deluje brez težav na macOS.

## Obravnavane alternative
- bcrypt (nativna knjižnica).
- argon2.
- bcryptjs (čisti JavaScript).

## Sprejeta odločitev in utemeljitev
Izbran je bcryptjs. Ne zahteva prevajanja in deluje brez težav na macOS, tudi na Apple Silicon.

## Posledice

### Pozitivne
- Preprosta namestitev brez prevajanja.
- Preizkušen algoritem bcrypt.

### Negativne
- Počasnejši od nativnega bcrypt.
- argon2 je novejši algoritem, ki ga priporoča več virov.
