# Solidlab Products — Detailed Context

Detaljert info om hvert produkt for å generere treffsikkert innhold.

## 🌊 Bølgevarsel (bolgevarsel.no)

### Hva det er
Norsk SaaS for kystværvarsel og bølgeprognoser. Real-time data fra Meteorologisk Institutt, Kystverket, og egne sensorer.

### Målgruppe (primær)
- Fritidsbåtfolk langs norskekysten (30-65 år)
- Fiskere (kyst og havfiske)
- Kajakkpadlere, surfere, SUP-padlere
- Maritime bedrifter (småskala)

### Målgruppe (sekundær)
- Pårørende som vil overvåke familie på sjøen
- Turoperatører (kajakk, båttur)
- Sjøredningsentusiaster

### Features
- Live bølgedata fra 50+ målepunkter langs norskekysten
- 7-dagers bølgeprognose per havn/sted
- **SOS-modul:** Ring nødkontakter via IVR + SMS samtidig
- Live sjødashboard på /dashboard
- Knowledge base på /hjelp
- React Native app (Expo) under utvikling
- Integrert værmelding + tidevann + vindvarsel

### Priser
- **Kyst:** 49 kr/mnd — grunnleggende
- **Familie:** 99 kr/mnd — opptil 5 familiemedlemmer
- **Pro:** 199 kr/mnd — kommersiell bruk + API

### Tech stack
Next.js 14, Supabase (`zqodoekmswibvjzhtixf`), Vercel, Stripe, 46elks (SMS+IVR), ElevenLabs (TTS)

### Tone når vi snakker om Bølgevarsel
- **Alvorlig uten å være dyster** — det handler om sikkerhet
- **Konkret** — ikke "komplett værvarsel", si "7-dagers bølgeprognose"
- **Faktabasert** — data fra MET og Kystverket, ikke vår egen tolkning
- **Maritim vokabular** — stille sjø, kabellengde, havn, kyling, grov sjø

### Typiske content-vinkler
- "SOS-knappen som redder liv" (safety-first angle)
- "4 måneder fra idé til betalende kunder" (builder angle)
- "Norsk værvarsel for båtfolk — laget i Stavanger" (lokalpatriotisk)
- "Hva vi lærte fra 780 brukere i første kvartal" (data-driven)

---

## 🎨 Lara AI (getlara.app)

### Hva det er
AI-bildegenerator-app. Norsk-språklig interface, bygget for kreatører og småbedrifter som trenger bilder raskt.

### Målgruppe
- Content creators uten designer-budsjett
- Småbedrifter som trenger produktbilder
- Frilansere og konsulenter
- Nordmenn som foretrekker norsk interface

### Features
- Text-to-image (Imagen 4, gemini-2.5-flash-image)
- Image editing (inpainting, outpainting)
- Galleri med lagrede bilder + modal
- Norsk Supabase auth (email/passord + Google OAuth kommende)
- Stripe-betaling (199 kr Pro)
- Resend e-post fra noreply@getlara.app

### Priser
- **Gratis:** 5 bilder/dag
- **Pro:** 199 kr/mnd — ubegrenset

### Tone når vi snakker om Lara
- **Lekent** — men ikke barnslig
- **Tilgjengelig** — "for alle som vil lage noe"
- **Norsk først** — fremhev at interfaces er på norsk
- **Kreativ** — vi oppmuntrer eksperimentering

### Typiske content-vinkler
- "Norsk AI-bildegenerator for de som hater engelsk UI"
- "Fra idé til Instagram-post på 30 sekunder"
- "For småbedrifter uten designerbudsjett"

---

## 🆘 KYST (Bølgevarsel hardware)

### Hva det er
GPS+4G SOS-armbånd for båtfolk. OEM-kandidat: Mictrack B2316. I konseptfase.

### Målgruppe
- Bølgevarsel Pro-brukere
- Profesjonelle på sjøen (fiskere, maritimbedrifter)
- Sikkerhetsbevisste fritidsbåtfolk

### Features (planlagt)
- GPS-posisjonering med 2m nøyaktighet
- 4G-tilkobling (ingen telefon nødvendig)
- SOS-knapp med bekreftelse (unngår false alarms)
- Integrerer med Bølgevarsel-appen
- Batteritid: ~30 dager standby

### Tone når vi snakker om KYST
- **Pragmatisk sikkerhet** — som en redningsvest, men smartere
- **Aldri overdrevet** — "dette kan hjelpe" ikke "dette redder alltid liv"
- **Hardware first** — solid, testet, holdbar

### Typiske content-vinkler
- "Hardware-arm av Bølgevarsel-SaaS — én knapp, full redning"
- "Hvorfor vi bygger hardware når alt er software"

---

## 🤖 Jens (intern AI-assistent)

### Hva det er
Ulriks personlige AI-assistent + voice/SMS-automatisering (jens-voice.vercel.app). Bruker 46elks + Google TTS (nb-NO-Wavenet-D).

### Målgruppe
- Intern bruk primært
- Kunde-showcase (demo av hva som er mulig)

### Features
- Voice calls via Norwegian Wavenet
- SMS-sender med navn "Jens"
- Koblet til 46elks API
- Bruker Claude Desktop som backend

### Tone når vi snakker om Jens
- **Lekent** — han er nesten en maskot
- **Teknisk** når målgruppen er tech-folk
- **Transparent** — vi skjuler ikke at Jens er AI

### Typiske content-vinkler
- "Min AI-assistent ringer når noe er galt"
- "Automatisering som føles personlig"

---

## 🏢 Solidlab (overordnet brand)

### Hva det er
Nordisk venture lab. Bygger egne produkter OG investerer i andre. Established Jan 2026, Stavanger.

### Strategi
1. **Bygge:** Egne SaaS-produkter (Bølgevarsel, Lara)
2. **Backe:** Early-stage-investeringer i nordiske founders
3. **Konsulent-arbeid:** Digitale systemer for klinikker, småbedrifter

### Kunder (konsulent-siden)
- Stavanger Plastikkirurgi (Stapla) — hovedkunde
- Forusklinikken
- Ultralydjordmoren

### Juridisk
- **Stå på Pinne AS** (org.nr 935 233 488)
- Eid av Ulrik (majoritet) + Charlotte
- Adresse: Tunveien 13, 4016 Stavanger

### Økonomi (grovt)
- Ulrik tar ut ~40 000/mnd i lønn
- Utleie (3 boliger) supplementer
- Konsulent-omsetning fra Stapla, Forusklinikken etc.

### Tone når vi snakker om Solidlab (parent brand)
- **Reflektert** — vi bygger rolig og stødig
- **Håndverksorientert** — kvalitet over volum
- **Ærlig** — "sometimes chaos" er i taglinen for en grunn
- **Nordisk** — ikke silicon valley, ikke london, Stavanger

### Typiske content-vinkler
- "Venture lab fra Stavanger — bygger og backer"
- "Kvartalsoppsummering: 3 produkter, 4 kunder, 2 investeringer"
- "Hvorfor vi bygger fra Stavanger og ikke flytter til Oslo"
