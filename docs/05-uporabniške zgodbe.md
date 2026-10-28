# 05 – Uporabniške zgodbe

Uporabniške zgodbe pokrivajo vseh 13 funkcionalnosti iz 1. naloge (F1–F13). US-01 do US-08 so MVP (F1–F6). Pisal sem jih po INVEST: ena zgodba, ena vrednost, dovolj majhna za en korak razvoja in s pogoji, ki jih lahko preveriš. Če je kakšna odvisna od druge, to piše zraven (US-05 rabi načrt iz US-04). Obiskovalec je nekdo, ki še nima računa. Ko se registrira (US-01), je član.

## US-01: Registracija
- Povezana funkcionalnost: F1 (MVP)
- Uporabniška vloga: Obiskovalec
- User story: Kot obiskovalec želim ustvariti račun z imenom, e-poštnim naslovom in geslom, da lahko beležim treninge in dobivam načrte od trenerja.
- Razlaga: Brez računa aplikacije ne moreš uporabljati, zato je to prvi korak. Vsak novi uporabnik je član. Trenerja ali skrbnika naredi samo skrbnik, sam si take pravice ne more dati nihče.
- Acceptance criteria:
  - Obrazec zahteva ime, veljaven e-poštni naslov in geslo z vsaj 8 znaki. Če katero polje manjka, e-pošta ni veljavna ali je geslo prekratko, se pokaže ustrezno sporočilo in računa ne ustvari.
  - Če račun s tem e-poštnim naslovom že obstaja: »E-poštni naslov je že registriran«.
  - Po uspešni registraciji je uporabnik član in pristane na prijavi.
  - Geslo v bazi ni navaden tekst, ampak zgostitev.

## US-02: Prijava in odjava
- Povezana funkcionalnost: F1 (MVP)
- Uporabniška vloga: Član, trener ali skrbnik
- User story: Kot registriran uporabnik se želim prijaviti z e-poštnim naslovom in geslom, da imam dostop do svojih podatkov in funkcij, ki pripadajo moji vlogi.
- Razlaga: Prijava pove, kdo si, in od tega je odvisno, kaj vidiš in kaj smeš. Blokirani ne pridejo noter, odjava dostop konča.
- Acceptance criteria:
  - Pri pravilnih podatkih se ustvari seja in uporabnik vidi meni za svojo vlogo (član, trener ali skrbnik).
  - Napačno geslo ali neobstoječ e-poštni naslov dasta isto sporočilo: »Napačen e-poštni naslov ali geslo«.
  - Blokiran uporabnik se ne more prijaviti in vidi sporočilo, da je račun blokiran.
  - Neprijavljen, ki odpre zaščiteno stran, gre na prijavo.
  - Po odjavi seja ne velja več. Zaščitene strani so spet zaprte, dokler se ne prijavi znova.

## US-03: Pregled knjižnice vaj
- Povezana funkcionalnost: F2 (MVP)
- Uporabniška vloga: Član
- User story: Kot član želim pregledovati knjižnico vaj in jih filtrirati po mišični skupini, da hitro najdem vajo, ki jo iščem.
- Razlaga: Vaje moraš poznati, da jih lahko izbereš pri vnosu treninga. Filter pride prav, ko je vaj veliko.
- Acceptance criteria:
  - Pri vsaki vaji so naziv, mišična skupina in oprema.
  - Izbira mišične skupine (prsa, hrbet, noge, ramena, roke ali trebuh) pokaže samo vaje iz te skupine.
  - »Vse« pokaže vse vaje.
  - Klik na vajo odpre opis izvedbe.
  - Če v skupini ni vaj, piše »Ni vaj v tej skupini«.

## US-04: Sestavljanje načrta vadbe
- Povezana funkcionalnost: F3 (MVP)
- Uporabniška vloga: Trener
- User story: Kot trener želim sestaviti načrt vadbe z dnevi, vajami, serijami in ponovitvami, da lahko članu pripravim strukturiran program.
- Razlaga: Načrt je glavna stvar v sodelovanju med trenerjem in članom. Član ve, kaj mora narediti, trener pa ima kaj spremljati.
- Acceptance criteria:
  - Načrt rabi naziv in vsaj en dan z vsaj eno vajo. Če naziva ni ali ni nobene vaje, se ne shrani in aplikacija pove, zakaj.
  - Vajo izberem iz knjižnice. Pri vsaki določim serije (1–10) in ponovitve (1–50). Če je vrednost zunaj razpona ali ni veljavna, se pokaže napaka in načrt se ne shrani, dokler je ne popravim.
  - Dodam lahko več dni in več vaj na dan. Vajo ali dan lahko tudi odstranim.
  - Ob shranjevanju dobi načrt stanje »osnutek« in ga vidim samo jaz.
  - Član in skrbnik te strani ne moreta odpreti.

## US-05: Dodelitev načrta članu
- Povezana funkcionalnost: F4 (MVP)
- Uporabniška vloga: Trener
- User story: Kot trener želim osnutek načrta dodeliti članu, da član dobi program, ki ga bom spremljal.
- Razlaga: Dokler načrta ne dodelim, je samo osnutek. Z dodelitvijo se ve, kdo ga dela in kdo ga spremlja. Zato gre samo za osnutek.
- Acceptance criteria:
  - Izbiram lahko samo med člani, ki niso blokirani.
  - Dodeliti je mogoče samo načrt v stanju »osnutek«. Po uspešni dodelitvi je stanje »dodeljen«.
  - Če načrt ni več osnutek, sistem dodelitev zavrne: »Dodeliti je mogoče samo osnutek načrta«.
  - Dodeljen načrt se pojavi na seznamu načrtov tega člana.
  - Načrta drugega trenerja ne morem dodeliti (strežnik vrne napako 403).

## US-06: Sprejem načrta
- Povezana funkcionalnost: F4 (MVP)
- Uporabniška vloga: Član
- User story: Kot član želim sprejeti dodeljeni načrt, da ga lahko začnem izvajati in po njem vnašati treninge.
- Razlaga: S sprejemom član potrdi, da bo načrt res delal. Šele potem je aktiven in nanj lahko vežem treninge.
- Acceptance criteria:
  - Na seznamu so samo načrti, ki so dodeljeni meni.
  - Gumb »Sprejmi« je samo pri načrtih v stanju »dodeljen«. Po kliku je stanje »aktiven«.
  - Trening, vezan na načrt, lahko vnesem samo pri aktivnem načrtu.
  - Načrta, ki je dodeljen drugemu članu, ne morem sprejeti (strežnik vrne napako 403).

## US-07: Vnos treninga
- Povezana funkcionalnost: F5 (MVP)
- Uporabniška vloga: Član
- User story: Kot član želim po treningu vnesti vaje s serijami (teža in ponovitve), da imam zapisano, kaj sem naredil.
- Razlaga: Iz tega zapisa pridejo zgodovina, rekordi, napredek in komentarji trenerja. Brez njega teh podatkov ni.
- Acceptance criteria:
  - Datum je privzeto današnji, lahko ga spremenim.
  - Dodam lahko več vaj iz knjižnice, pri vsaki vsaj eno serijo. Serija ima težo v kg (več kot 0 in največ 500) in ponovitve (1–100).
  - Trening lahko povežem z enim svojim aktivnim načrtom, ni pa nujno.
  - Trening se ne shrani, če nima nobene vaje, če pri kakšni seriji manjka teža ali ponovitve ali če vrednosti niso v dovoljenem razponu (teža mora biti večja od 0 in največ 500 kg, ponovitve pa med 1 in 100). Pokaže se ustrezno sporočilo o napaki.
  - Shranjen trening se pokaže v moji zgodovini.

## US-08: Samodejno zaznavanje osebnih rekordov
- Povezana funkcionalnost: F6 (MVP)
- Uporabniška vloga: Član
- User story: Kot član želim, da aplikacija sama zazna moje osebne rekorde, da vidim, kdaj sem napredoval.
- Razlaga: Rekordi pokažejo napredek, ne da bi moral sam iskati in primerjati, in so za člana tudi motivacija. Prvi vnos je samo izhodišče, ker ga ni s čim primerjati.
- Acceptance criteria:
  - Ob shranjevanju treninga aplikacija pri vsaki vaji primerja najvišjo težo v tem treningu z najvišjo težo iste vaje v mojih prejšnjih treningih.
  - Višja teža pomeni rekord. Vaja je označena, po shranjevanju pa se pokaže sporočilo z nazivom vaje in težo.
  - Prvi vnos vaje ni rekord, ampak izhodišče.
  - Enaka teža ni rekord.
  - Rekord je viden pri treningu v zgodovini.

## US-09: Zgodovina treningov
- Povezana funkcionalnost: F7
- Uporabniška vloga: Član
- User story: Kot član želim pregledati svoje pretekle treninge, da vidim, kaj sem treniral in kdaj.
- Razlaga: Da vidim, kaj sem delal, in se pripravim na naslednjič.
- Acceptance criteria:
  - Seznam ima samo moje treninge, najnovejše na vrhu, največ 10 na stran.
  - Pri vsakem so datum, število vaj, naziv načrta (če je trening vezan na načrt) in oznaka rekorda.
  - Klik na trening odpre podrobnosti z vsemi vajami in serijami.
  - Če treningov še ni: »Še nimate treningov«.
  - Treninga drugega člana ne morem odpreti (strežnik vrne napako 403).

## US-10: Napredek po vaji
- Povezana funkcionalnost: F8
- Uporabniška vloga: Član
- User story: Kot član želim videti, kako se je skozi čas spreminjala moja najvišja teža pri izbrani vaji, da vidim svoj napredek.
- Razlaga: Tako se vidi, ali načrt dela, in lažje izberem težo za naslednji trening.
- Acceptance criteria:
  - Vajo izberem iz knjižnice.
  - Pokaže se seznam datumov z najvišjo težo na ta dan, od najstarejšega do najnovejšega.
  - Na vrhu je moj trenutni osebni rekord pri tej vaji.
  - Če vaje še nisem vnesel v noben trening: »Ni podatkov za to vajo«.

## US-11: Pregled treningov članov in komentar
- Povezana funkcionalnost: F9
- Uporabniška vloga: Trener
- User story: Kot trener želim pregledati treninge članov, ki imajo moj načrt, in jih komentirati, da jim dam povratno informacijo.
- Razlaga: Zaradi povratne informacije ima načrt sploh smisel. Trener vidi samo člane s svojim načrtom, podatki vseh drugih ostanejo zaščiteni.
- Acceptance criteria:
  - Na seznamu so samo člani, ki imajo od mene dodeljen, aktiven ali zaključen načrt.
  - Pri izbranem članu vidim njegove treninge z vajami, serijami in oznakami rekordov.
  - Komentar je lahko dolg do 500 znakov in se shrani k izbranemu treningu.
  - Član komentar vidi v podrobnostih svojega treninga.
  - Treninga člana, ki nima mojega načrta, ne morem odpreti (strežnik vrne napako 403).

## US-12: Zaključek načrta
- Povezana funkcionalnost: F10
- Uporabniška vloga: Trener
- User story: Kot trener želim načrt zaključiti, ko ga član izpolni, da se ne uporablja več za nove treningFe.
- Razlaga: Končani načrti se ločijo od aktivnih in nihče ne vnaša treningov v načrt, ki ga član ne dela več. Zgodovina ostane.
- Acceptance criteria:
  - Gumb »Zaključi« je samo pri aktivnem načrtu, ki sem ga naredil jaz. Po kliku je stanje »zaključen«.
  - Član ne more več vnašati novih treningov, vezanih na zaključen načrt.
  - Zaključen načrt in že vneseni treningi ostanejo vidni.
  - Zaključenega načrta ni mogoče spet aktivirati.

## US-13: Urejanje osnutka načrta
- Povezana funkcionalnost: F11
- Uporabniška vloga: Trener
- User story: Kot trener želim urejati načrt, dokler je osnutek, da lahko popravim napake, preden ga dodelim članu.
- Razlaga: Osnutek je lahko popraviti, ker ga član še ne vidi. Ko je načrt dodeljen, bi sprememba posegla v nekaj, kar član že izvaja.
- Acceptance criteria:
  - Urejam lahko samo načrt v stanju »osnutek«, ki sem ga naredil jaz.
  - Spremembe naziva, dni, vaj, serij in ponovitev se shranijo.
  - Pri dodeljenem, aktivnem ali zaključenem načrtu gumba »Uredi« ni, strežnik pa spremembo zavrne z napako 403.
  - Načrta drugega trenerja ne morem urejati.

## US-14: Upravljanje uporabnikov
- Povezana funkcionalnost: F12
- Uporabniška vloga: Skrbnik
- User story: Kot skrbnik želim upravljati vloge in blokade uporabnikov, da imajo dostop samo ustrezni ljudje.
- Razlaga: Skrbnik odloča, kdo je trener ali skrbnik, in lahko koga izključi. S tem so podatki članov varni.
- Acceptance criteria:
  - Seznam pokaže vse uporabnike z imenom, e-pošto, vlogo in stanjem (aktiven ali blokiran).
  - Vlogo lahko spremenim v član, trener ali skrbnik. Sprememba velja pri uporabnikovi naslednji zahtevi.
  - Blokiran se ne more prijaviti. Blokado lahko odstranim.
  - Vloge in blokade lahko spreminja samo skrbnik, drugi dobijo napako 403.
  - Gesel in zgostitev gesel seznam ne prikazuje.

## US-15: Upravljanje knjižnice vaj
- Povezana funkcionalnost: F13
- Uporabniška vloga: Skrbnik
- User story: Kot skrbnik želim dodajati in urejati vaje v knjižnici, da imajo trenerji in člani na voljo ažuren seznam vaj.
- Razlaga: Knjižnico uporabljajo vsi načrti in vsi treningi. Če jo ureja en človek, ni podvojenih ali zmedenih vaj.
- Acceptance criteria:
  - Nova vaja rabi unikaten naziv, mišično skupino s seznama (prsa, hrbet, noge, ramena, roke, trebuh), opremo in opis.
  - Če vaja z istim nazivom že obstaja: »Vaja s tem nazivom že obstaja«.
  - Obstoječo vajo lahko urejam, spremembe so takoj vidne v knjižnici.
  - Člani in trenerji vaj ne morejo dodajati ali urejati (strežnik vrne napako 403).