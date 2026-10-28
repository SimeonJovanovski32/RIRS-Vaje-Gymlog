# ADR-0001: Ločen frontend in REST API

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
GymLog potrebuje spletni vmesnik za tri vloge (član, trener, skrbnik) in strežniško logiko (stanja načrta, zaznava rekordov, preverjanje pravic). Odločiti se je treba, ali strani izrisuje strežnik ali ločen frontend kliče API.

## Obravnavane alternative
- Strežnik izrisuje strani (npr. Express z EJS predlogami) brez ločenega API-ja.
- Ločen frontend, ki prek REST API in JSON kliče backend.
- Ločen frontend in GraphQL API.

## Sprejeta odločitev in utemeljitev
Izbrana je ločen frontend z REST API. Prikaz in logika sta jasno ločena, isti API lahko kasneje uporabijo grafi napredka ali mobilna aplikacija (nadgradnji iz dokumenta 02), obrazca z ponavljajočimi se vrsticami pa sta lažja v komponentah. GraphQL je za obseg projekta pretežak.

## Posledice

### Pozitivne
- Prikaz in logika sta razvita in preizkušena ločeno.
- API je mogoče ponovno uporabiti.
- API je mogoče testirati neodvisno od vmesnika (npr. s Postmanom).

### Negativne
- Dve aplikaciji, ki ju je treba vzdrževati in zagnati.
- Več nastavitev (posredovanje zahtev, piškotki).
- Več kode kot pri strežniškem izrisu strani.
