# ADR-0007: Seje s piškotki namesto JWT

- Status: sprejeto
- Datum: 2026-10-28

## Kontekst in problem
Uporabniki se prijavijo, strežnik pa mora pri vsaki zahtevi vedeti, kdo je uporabnik in kakšno vlogo ima.

## Obravnavane alternative
- JWT v piškotku httpOnly.
- JWT v localStorage.
- Strežniške seje (express-session) s piškotkom httpOnly in shranjevanjem v MongoDB.

## Sprejeta odločitev in utemeljitev
Izbrane so strežniške seje. So enostavnejše za aplikacijo z eno domeno, blokiranje uporabnika ali odjava veljata takoj, piškotek httpOnly pa ni dostopen skriptam v brskalniku.

## Posledice

### Pozitivne
- Takojšnja razveljavitev seje (odjava, blokada).
- Piškotek ni dostopen skriptam.
- Manj kode kot pri lastnem upravljanju žetonov.

### Negativne
- Seje so shranjene v bazi in jih je treba brati ob zahtevah.
- Pri več strežnikih je potrebna skupna shramba sej.
- Potrebna je zaščita pred CSRF (npr. SameSite).
