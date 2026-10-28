# ADR-0005: Vgnezdeni dnevi načrta in serije treninga

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Pri modelu podatkov je treba določiti, katere podatke shranimo v isti dokument in katere v ločene zbirke.

## Obravnavane alternative
- Dnevi, postavke, zapisi in serije v ločenih zbirkah z referencami.
- Dnevi in postavke vgnezdeni v načrt, zapisi in serije vgnezdeni v trening; uporabniki, vaje, načrti in treningi so samostojne zbirke.

## Sprejeta odločitev in utemeljitev
Izbrano je vgnezdenje. Dnevi in postavke se vedno berejo skupaj z načrtom, serije pa skupaj s treningom, zato je ena poizvedba dovolj.

## Posledice

### Pozitivne
- Enostavno branje in pisanje celotnega načrta ali treninga.
- Zapis treninga je atomaren (en dokument).

### Negativne
- Dokument z leti raste (v praksi dovolj majhen).
- Poizvedbe po posameznih serijah čez več treningov so zahtevnejše.
