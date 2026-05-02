# Hvordan sette opp Solidlab Content Studio som Claude Project

## 🎯 Målet

Etter 10 minutter skal du ha et Claude Project hvor du kan si:
> "LinkedIn-post om Bølgevarsel-milestone"

…og få on-brand content umiddelbart, uten å forklare kontekst hver gang.

## 🛠️ Steg-for-steg

### Steg 1: Opprett Claude Project

1. Gå til **[claude.ai](https://claude.ai)**
2. I venstre sidebar: klikk **"Projects"** → **"New project"**
3. **Navn:** `Solidlab Content Studio`
4. **Beskrivelse:** `AI content creator for Solidlab og produktene — LinkedIn, Instagram, blog, e-post, bilder`
5. Klikk **"Create project"**

### Steg 2: Sett custom instructions

1. I prosjektet, klikk **"Set custom instructions"** (øverst)
2. Kopier HELE innholdet av filen: 
   ```
   ~/solidlab-brand/project-setup/01-project-instructions.md
   ```
3. Lim inn i custom instructions-feltet
4. Klikk **"Save"**

Dette blir Claude sin "personlighet" når du bruker dette prosjektet.

### Steg 3: Last opp kontekst-filer

1. I prosjektet, klikk **"Add content"** → **"Upload from computer"**
2. Last opp disse filene (finn dem i `~/solidlab-brand/project-setup/`):
   - `02-content-templates.md` — 20 ferdige templates
   - `03-product-context.md` — Detaljert info om hvert produkt
3. Valgfritt: Last også opp:
   - `~/solidlab-brand/colors_and_type.css` — Brand-farger som kode
   - `~/solidlab-brand/assets/solidlab-brand-guidelines-v1.1-nordic.pdf` — Full brand-manual

### Steg 4: Test det

Start en ny chat INNE I PROSJEKTET, og test med:

**Test 1 — Enkel LinkedIn-post:**
```
Lag en LinkedIn-post om at Solidlab bestilte første runde merch 
fra Vistaprint. Tone: håndverksorientert, ikke salgsete.
```

**Test 2 — Instagram-caption:**
```
Instagram-caption til et bilde av Simba (katten) som sover på 
laptopen. Lekent men ikke for mye.
```

**Test 3 — Blog-intro:**
```
Blog-intro til artikkel om hvorfor vi valgte Stavanger over Oslo 
for Solidlab. Målgruppe: andre nordiske founders.
```

**Test 4 — Bildeprompt:**
```
Generer bildeprompt for Nano Banana for et hero-bilde til 
Bølgevarsel-lansering. Skal vise nordisk fisker på sjøen 
med app i hånda.
```

## 🎯 Hva du vil merke

### Etter oppsett fungerer dette:
- Du trenger IKKE forklare at Solidlab er en venture lab
- Du trenger IKKE liste fargepaletten hver gang
- Du trenger IKKE si "bruk nordisk tone"
- Claude vet allerede hvem Silje og Charlotte er
- Claude kjenner Bølgevarsels features og målgruppe

### Smart triks:
- **Si produktnavnet** (Bølgevarsel, Lara, KYST) og Claude tilpasser tonen automatisk
- **Spør om "3 varianter"** så får du forskjellige approach-er
- **Bruk "kortere" eller "mer teknisk"** for rask iterasjon
- **Be om bildeprompt** parallelt med tekst — Claude kan generere begge

## 💡 Avansert: Webapp senere

Når du har brukt Claude Project i 1-2 uker og kjent ut hva som funker, kan vi bygge webappen (`studio.solidlab.ai`) basert på faktisk bruk. Det sparer deg for å bygge features du ikke trenger.

Webappen vil typisk ha:
- Claude API med samme instructions (gjenbruker denne filen)
- Supabase for å lagre historikk
- One-click export til LinkedIn/X/Instagram
- Bildegenerering via Imagen API
- Template-bibliotek som dropdown
- Analytics på hva som fungerer

## 📁 Filer som brukes

Alt finnes lokalt på:
```
~/solidlab-brand/project-setup/
├── 01-project-instructions.md    # Claude's personality & rules
├── 02-content-templates.md       # 20 ferdige templates
├── 03-product-context.md         # Detaljert produkt-info
└── 04-setup-guide.md             # Denne filen
```

## 🆘 Hvis noe går galt

### Claude ignorerer brand voice
→ Sjekk at custom instructions er lagret (skal vises øverst i chat)

### Claude gjetter feil produkt-fakta
→ Sørg for at `03-product-context.md` er lastet opp til prosjektet

### Claude skriver engelsk når du skriver norsk
→ Si "svar på norsk" i første melding, eller legg til i instructions

### Claude blir for generisk
→ Bruk mer spesifikke prompts: "LinkedIn-post om Bølgevarsel, med tall fra sist uke" i stedet for "noe om Bølgevarsel"

## 🎾 Neste steg etter oppsett

1. **Test i 1 uke** — lag 5-10 posts, noter hva som funker
2. **Iterate instructions** — oppdater `01-project-instructions.md` basert på det du lærer
3. **Bygg webapp** — når behovet er tydelig, bygger vi studio.solidlab.ai
