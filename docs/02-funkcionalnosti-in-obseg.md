# 02 – Funkcionalnosti in obseg

## Uporabniške vloge

### Član
- **Lahko:** se prijavi, pregleduje knjižnico vaj, sprejme dodeljeni načrt, vnaša svoje treninge, vidi zgodovino, osebne rekorde in napredek po vajah, bere komentarje trenerja.
- **Ne more:** sestavljati načrtov, videti treninge drugih članov, dodajati vaj v knjižnico, upravljati uporabnikov.

### Trener
- **Lahko:** sestavlja in ureja načrte (dokler so osnutek), jih dodeli članu, vidi treninge članov, ki imajo od njega načrt, komentira treninge, zaključi načrt.
- **Ne more:** videti treninge članov brez dodeljenega načrta, spreminjati treningov članov, upravljati uporabnikov.

### Skrbnik
- **Lahko:** dodeljuje vloge, blokira uporabnike, dodaja in ureja vaje v knjižnici.
- **Ne more:** sestavljati načrtov ali vnašati treningov.

## Predvidene funkcionalnosti

- F1: Registracija in prijava (MVP) – uporabnik se registrira z e-pošto in geslom, novi uporabnik je privzeto član, vlogo spremeni skrbnik.
- F2: Knjižnica vaj (MVP) – pregled vaj s filtrom po mišični skupini (prsa, hrbet, noge …).
- F3: Sestavljanje načrta vadbe (MVP) – trener sestavi načrt z dnevi in za vsak dan izbere vaje ter število serij in ponovitev.
- F4: Dodelitev in sprejem načrta (MVP) – trener načrt dodeli članu, član ga sprejme in šele nato postane aktiven (osnutek → dodeljen → aktiven).
- F5: Vnos treninga (MVP) – član za vsako vajo vnese serije (teža in ponovitve); trening je lahko vezan na aktivni načrt ali prost.
- F6: Samodejno zaznavanje osebnih rekordov (MVP) – ob shranjevanju treninga sistem primerja najvišjo težo s prejšnjimi treningi in označi nov rekord.
- F7: Zgodovina treningov – član vidi seznam svojih preteklih treningov.
- F8: Napredek po vaji – seznam najboljših težav pri izbrani vaji po datumih.
- F9: Pregled treningov članov in komentar trenerja – trener vidi treninge članov, ki imajo od njega načrt, in jih komentira.
- F10: Zaključek načrta – trener označi načrt kot zaključen.
- F11: Urejanje načrta – trener lahko načrt ureja, dokler je osnutek.
- F12: Upravljanje uporabnikov – skrbnik dodeljuje vloge in blokira uporabnike.
- F13: Upravljanje knjižnice vaj – skrbnik dodaja in ureja vaje.

Domensko specifične MVP-funkcionalnosti: F4, F5, F6.

### Delovni proces: življenjski cikel načrta
```
osnutek → dodeljen → aktiven → zaključen
```
- Trener ustvari načrt (osnutek) in ga dodeli članu (dodeljen).
- Član načrt sprejme (aktiven) in šele nato lahko vnaša treninge vezane na načrt.
- Trener načrt zaključi (zaključen).

### Pravilo osebnih rekordov
Pri vsakem shranjenem treningu sistem za vsako vajo primerja najvišjo težo s prejšnjimi treningi istega člana pri tej vaji. Če je teža višja, se vaja označi kot nov osebni rekord. Prvi vnos vaje je izhodišče in ni rekord.

## Kasnejše nadgradnje
1. Grafi napredka po vaji.
2. Beleženje telesne teže in obsegov.
3. Samodejni predlogi povečanja teže (progresivna obremenitev).
4. Obvestila po e-pošti (npr. trener komentiral trening).
5. Fotografije napredka.
6. Mobilna aplikacija.

## Out of scope
- Skupinske vadbe, urniki in rezervacije terminov.
- Plačila in članarine.
- Beleženje prehrane in kalorij.
- Povezava s pametnimi urami in merilniki.
- Mobilna aplikacija.