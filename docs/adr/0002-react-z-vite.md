# ADR-0002: React z Vite za frontend

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Za frontend potrebujemo ogrodje, ki dobro podpira obrazce s ponavljajočimi se vrsticami (sestavljanje načrta, vnos serij) in usmerjanje med stranmi.

## Obravnavane alternative
- Vue 3 z Vite.
- React z Vite.
- Angular.
- Navaden JavaScript brez ogrodja.

## Sprejeta odločitev in utemeljitev
Izbran je React z Vite in React Router. Je najbolj razširjeno ogrodje z veliko gradiva, stanje komponent olajša obrazca s ponavljajočimi se vrsticami, Vite pa omogoča hiter razvoj. Vue je bil obravnavan in je za učenje nekoliko preprostejši, Angular je za ta obseg pretežak.

## Posledice

### Pozitivne
- Veliko gradiva in primerov.
- Komponente ustrezajo zaslonom iz wireframov.
- Hiter razvoj z Vite.

### Negativne
- Za začetnika je več pojmov (hooks, stanje, učinki) kot pri Vue.
- Usmerjanje in preostale zmožnosti zahtevajo dodatne knjižnice.
