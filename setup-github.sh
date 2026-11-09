#!/usr/bin/env bash
# GymLog – priprava GitHub Projecta, label in Issues za MVP (US-01 do US-08)
# Zaženi ENKRAT iz mape repozitorija:  bash setup-github.sh
set -euo pipefail

OWNER="SimeonJovanovski32"
REPO="RIRS-Vaje-Gymlog"
FULL="$OWNER/$REPO"
PROJECT_TITLE="GymLog MVP"

gh auth status >/dev/null || { echo "Najprej: gh auth login"; exit 1; }

echo "==> Labele"
mk_label() { gh label create "$1" --color "$2" --description "$3" --repo "$FULL" --force >/dev/null; }
for i in 01 02 03 04 05 06 07 08; do mk_label "US-$i" "f97316" "Uporabniška zgodba US-$i"; done
mk_label "setup"    "6b7280" "Priprava projekta"
mk_label "backend"  "2563eb" "Backend (Express/MongoDB)"
mk_label "frontend" "16a34a" "Frontend (React)"
mk_label "docs"     "a855f7" "Dokumentacija"

echo "==> GitHub Project"
PNUM=$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json --jq '.number')
gh project link "$PNUM" --owner "$OWNER" --repo "$FULL" >/dev/null || true
echo "    Project #$PNUM ustvarjen in povezan z repozitorijem"

echo "==> Issues"
issue() { # naslov | labele | telo
  local url
  url=$(gh issue create --repo "$FULL" --title "$1" --label "$2" --body "$3" --project "$PROJECT_TITLE")
  echo "    $url"
}

# ---------- SETUP ----------
issue "Setup: ogrodje backenda (Express, Mongoose, .env)" "setup,backend" \
"Opis: Inicializacija mape \`backend\` (npm init, express, mongoose, dotenv, nodemon), povezava z MongoDB prek \`MONGODB_URI\`, osnovna struktura (models, routes, middleware), \`.env.example\`, skripta \`npm start\`.

Sprejemljivo, ko: \`npm start\` zažene API na http://localhost:3000 in se poveže z bazo."

issue "Setup: ogrodje frontenda (Vite, React Router, proxy /api)" "setup,frontend" \
"Opis: Inicializacija mape \`frontend\` (Vite + React), React Router, Vite proxy za \`/api\` na backend (ADR-0003), osnovni layout in meni.

Sprejemljivo, ko: \`npm run dev\` odpre aplikacijo na http://localhost:5173 in zahteve na \`/api\` pridejo do backenda."

issue "Setup: seed skripta (vaje, testni uporabniki)" "setup,backend" \
"Opis: Skripta \`npm run seed\`, ki naloži začetne vaje (skupine: prsa, hrbet, noge, ramena, roke, trebuh) in testne uporabnike (član, trener, skrbnik).

Sprejemljivo, ko: po zagonu skripte so vaje in uporabniki v bazi; ponoven zagon ne naredi podvojenih zapisov."

# ---------- US-01 ----------
issue "US-01: API za registracijo" "US-01,backend" \
"Opis: \`POST /api/auth/register\`, model User (email, passwordHash, ime, vloga, blokiran), zgostitev gesla z bcryptjs.

Pogoji sprejemljivosti (US-01):
- ime, veljaven e-poštni naslov, geslo vsaj 8 znakov; sicer napaka in račun se ne ustvari
- obstoječ e-poštni naslov: »E-poštni naslov je že registriran«
- nov uporabnik je privzeto član
- geslo v bazi ni navaden tekst"

issue "US-01: Obrazec za registracijo (frontend)" "US-01,frontend" \
"Opis: Stran z registracijskim obrazcem (ime, e-pošta, geslo), prikaz napak, po uspehu preusmeritev na prijavo.

Pogoji sprejemljivosti (US-01): ustrezna sporočila ob manjkajočih poljih, neveljavni e-pošti, prekratkem geslu in obstoječem računu."

# ---------- US-02 ----------
issue "US-02: API za prijavo in odjavo (seje)" "US-02,backend" \
"Opis: \`POST /api/auth/login\`, \`POST /api/auth/logout\`, \`GET /api/auth/me\`, express-session + connect-mongo, piškotek httpOnly.

Pogoji sprejemljivosti (US-02):
- napačno geslo ali neobstoječa e-pošta: isto sporočilo »Napačen e-poštni naslov ali geslo«
- blokiran uporabnik se ne more prijaviti in dobi sporočilo o blokadi
- po odjavi seja ne velja več"

issue "US-02: Middleware za preverjanje seje in vloge" "US-02,backend" \
"Opis: \`requireAuth\` in \`requireRole(...)\` (ADR-0008), vrneta 401 oz. 403. Uporabi se na vseh zaščitenih poteh.

Sprejemljivo, ko: neprijavljen dobi 401, napačna vloga 403."

issue "US-02: Prijavna stran, zaščitene poti in meni po vlogi (frontend)" "US-02,frontend" \
"Opis: Prijavni obrazec, kontekst prijavljenega uporabnika, zaščitene poti (neprijavljen gre na prijavo), meni glede na vlogo, gumb za odjavo.

Pogoji sprejemljivosti (US-02): meni za član/trener/skrbnik; po odjavi so zaščitene strani zaprte."

# ---------- US-03 ----------
issue "US-03: API za knjižnico vaj" "US-03,backend" \
"Opis: Model Vaja (naziv, misicnaSkupina, oprema, opis), \`GET /api/vaje\` z opcijskim filtrom \`?misicnaSkupina=\`, \`GET /api/vaje/:id\`.

Pogoji sprejemljivosti (US-03): filter vrne samo vaje izbrane skupine, brez filtra vse vaje."

issue "US-03: Stran Knjižnica vaj (frontend)" "US-03,frontend" \
"Opis: Seznam vaj (naziv, skupina, oprema), gumbi za filter po skupini in »Vse«, klik odpre opis.

Pogoji sprejemljivosti (US-03): če v skupini ni vaj, piše »Ni vaj v tej skupini«."

# ---------- US-04 ----------
issue "US-04: API za sestavljanje načrta vadbe" "US-04,backend" \
"Opis: Model Nacrt (trenerId, clanId, naziv, stanje, dnevi z vgnezdenimi postavkami), \`POST /api/nacrti\`, \`GET /api/nacrti\` (glede na vlogo).

Pogoji sprejemljivosti (US-04):
- naziv in vsaj en dan z vsaj eno vajo
- serije 1–10, ponovitve 1–50
- novi načrt ima stanje »osnutek«, viden samo trenerju avtorju
- član in skrbnik nimata dostopa"

issue "US-04: Obrazec za sestavljanje načrta (frontend)" "US-04,frontend" \
"Opis: Obrazec z nazivom, dinamičnim dodajanjem/odstranjevanjem dni in vaj (izbira iz knjižnice, serije, ponovitve), shranjevanje osnutka.

Pogoji sprejemljivosti (US-04): napake pri neveljavnih vrednostih, načrt se ne shrani, dokler niso popravljene."

# ---------- US-05 ----------
issue "US-05: API za dodelitev načrta članu" "US-05,backend" \
"Opis: \`POST /api/nacrti/:id/dodeli\` z \`clanId\`, prehod osnutek → dodeljen.

Pogoji sprejemljivosti (US-05):
- samo člani, ki niso blokirani
- samo načrt v stanju »osnutek«, sicer »Dodeliti je mogoče samo osnutek načrta«
- načrt drugega trenerja: 403"

issue "US-05: Dodelitev načrta v UI (frontend)" "US-05,frontend" \
"Opis: Izbira člana in gumb »Dodeli« pri osnutku načrta, prikaz napak.

Pogoji sprejemljivosti (US-05): dodeljen načrt se pojavi na seznamu članovih načrtov."

# ---------- US-06 ----------
issue "US-06: API za sprejem načrta" "US-06,backend" \
"Opis: \`POST /api/nacrti/:id/sprejmi\`, prehod dodeljen → aktiven.

Pogoji sprejemljivosti (US-06):
- član vidi samo načrte, dodeljene njemu
- sprejem samo pri stanju »dodeljen«
- načrt drugega člana: 403"

issue "US-06: Seznam mojih načrtov in gumb Sprejmi (frontend)" "US-06,frontend" \
"Opis: Stran »Moji načrti« z gumbom »Sprejmi« samo pri načrtih v stanju »dodeljen«."

# ---------- US-07 ----------
issue "US-07: API za vnos treninga" "US-07,backend" \
"Opis: Model Trening (clanId, nacrtId, datum, zapisi z vgnezdenimi serijami), \`POST /api/treningi\`, \`GET /api/treningi\` (samo lastni).

Pogoji sprejemljivosti (US-07):
- vsaj ena vaja z vsaj eno serijo
- teža > 0 in največ 500 kg, ponovitve 1–100
- nacrtId neobvezen; če je podan, mora biti član lastnik in načrt aktiven
- trening se ne shrani ob neveljavnih podatkih"

issue "US-07: Obrazec za vnos treninga (frontend)" "US-07,frontend" \
"Opis: Datum (privzeto danes), izbira aktivnega načrta (neobvezno), dodajanje vaj in serij (teža, ponovitve), prikaz napak.

Pogoji sprejemljivosti (US-07): shranjen trening je viden v zgodovini."

# ---------- US-08 ----------
issue "US-08: Zaznavanje osebnih rekordov ob shranjevanju" "US-08,backend" \
"Opis: Ob \`POST /api/treningi\` za vsako vajo primerjaj najvišjo težo s prejšnjimi treningi istega člana in zapiši \`rekordi\` (ADR-0006).

Pogoji sprejemljivosti (US-08):
- višja teža = rekord
- prvi vnos vaje ni rekord
- enaka teža ni rekord
- rekordi so shranjeni pri treningu"

issue "US-08: Prikaz rekordov (sporočilo in oznaka REKORD)" "US-08,frontend" \
"Opis: Po shranjevanju sporočilo z nazivom vaje in težo, oznaka REKORD pri vaji, rekord viden tudi pri treningu v zgodovini.

Pogoji sprejemljivosti (US-08): sporočilo prikazuje naziv vaje in težo."

# ---------- DOCS ----------
issue "Docs: README z navodili za lokalni zagon" "docs,setup" \
"Opis: V \`README.md\` dokumentiraj korake: MongoDB (Homebrew), \`.env\`, seed, zagon backenda in frontenda, testni uporabniki. Popravi tudi povezavo do dokumenta 05.

Sprejemljivo, ko: nekdo brez predznanja zažene projekt samo po README."

echo
echo "Končano. Odpri: https://github.com/users/$OWNER/projects/$PNUM"
echo "Ročno še: v Projectu dodaj pogled Board in preimenuj stolpce v To Do / Doing / Done."
