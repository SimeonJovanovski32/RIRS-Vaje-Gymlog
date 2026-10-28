# ADR-0008: Preverjanje pravic na backendu

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Trije uporabniški tipi imajo različne pravice, člani in trenerji pa smejo videti samo svoje podatke.

## Obravnavane alternative
- Samo skrivanje strani in gumbov v frontendu.
- Preverjanje vloge in lastništva na backendu pri vsaki zahtevi, frontend pa skriva neustrezne strani zaradi udobja.

## Sprejeta odločitev in utemeljitev
Izbrano je preverjanje na backendu. Vsak lahko API pokliče neposredno (npr. s Postmanom), zato skrivanje v vmesniku ni dovolj.

## Posledice

### Pozitivne
- Podatki so zaščiteni tudi ob neposrednih klicih API-ja.
- Pravila so na enem mestu, v kodi backenda.

### Negativne
- Več kode pri vsaki poti.
- Nekatera pravila so podvojena v frontendu zaradi prikaza.
