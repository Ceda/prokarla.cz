# ProKarla.cz — Generátor přepravních dokladů

Webová aplikace pro generování přepravních dokumentů při vracení zboží z e-shopu [ProKarla.cz](https://prokarla.cz). Běží kompletně v prohlížeči — bez instalace, bez backendu.

## Co aplikace umí

### 📦 Přepravní štítek
- Štítek formátu A6 (148 × 105 mm) pro Českou poštu — odpovědní zásilka
- Automatické generování čárového kódu (Code 128) z tracking čísla
- Hromadné generování — více štítků najednou
- Tisk přímo z prohlížeče nebo stažení jako PDF
- Údaje odesílatele se ukládají do localStorage

### 📋 Průvodka vrácení zboží
- Dokument formátu A4 s přehledem vrácených položek
- Více objednávek na jedné průvodce, více průvodek najednou
- Tisk nebo stažení jako PDF

## Proč tento nástroj vznikl

Původní proces vrácení zboží vyžadoval vyplňování DOCX/PDF šablon v externím softwaru. Při tisku docházelo ke ztrátě české diakritiky. Tento nástroj řeší obojí — vše funguje přímo v prohlížeči s garantovanou diakritikou.

## Technologie

- **React 18** + Vite
- **JsBarcode** — generování čárových kódů
- **jsPDF + html2canvas** — export do PDF
- Čistě frontendová aplikace (žádný backend)

## Spuštění

```bash
npm install
npm run dev
```

Aplikace běží na `http://localhost:8081`

## Build

```bash
npm run build
```

## Struktura projektu

```
src/
├── components/
│   ├── HomePage.jsx        # Úvodní stránka
│   ├── LabelForm.jsx       # Formulář přepravního štítku
│   ├── LabelPreview.jsx    # Náhled štítku
│   ├── PruvodkaForm.jsx    # Formulář průvodky
│   └── PruvodkaPreview.jsx # Náhled + tisk průvodky
├── utils/
│   ├── barcode.js          # Generování čárových kódů
│   ├── labelTemplate.js    # HTML šablona štítku
│   └── pdfExport.js        # Export do PDF
├── App.jsx
└── App.css
```

## Autor

Vytvořil [Antonín Pleskač](https://blog.antoninpleskac.cz/) — © 2026
