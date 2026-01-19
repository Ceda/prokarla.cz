# GLS Generátor přepravních štítků

Aplikace pro generování GLS přepravních štítků s čárovými kódy.

## Funkce

- Generování štítků ve formátu A6 (100mm × 150mm)
- Code 128 čárový kód
- Informace o odesílateli a příjemci
- Detaily zásilky (počet balíků, hmotnost, služba)
- Tisk štítku přímo z prohlížeče

## Technologie

**Backend:**
- Node.js + Express
- bwip-js (generování čárových kódů)

**Frontend:**
- React 18
- Vite
- Axios

## Instalace a spuštění

### 1. Instalace backendu

```bash
cd backend
npm install
npm start
```

Backend běží na `http://localhost:3001`

### 2. Instalace frontendu

```bash
cd frontend
npm install
npm run dev
```

Frontend běží na `http://localhost:3000`

## Použití

1. Otevřete aplikaci v prohlížeči: `http://localhost:3000`
2. Vyplňte formulář s údaji o zásilce
3. Klikněte na "Generovat štítek"
4. V náhledu uvidíte generovaný štítek
5. Klikněte na "Tisk" pro vytisknutí štítku

## Formát štítku

- Rozměry: 100mm × 150mm (A6)
- Formát tisku: doporučeno nastavit jako A6 v tiskových předvolbách

## Struktura projektu

```
label-generator/
├── backend/
│   ├── server.js          # Express server s API
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LabelForm.jsx
    │   │   ├── LabelForm.css
    │   │   ├── LabelPreview.jsx
    │   │   └── LabelPreview.css
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## API endpointy

### `GET /api/barcode/:text`
Vrací čárový kód jako base64 obrázek.

### `POST /api/label`
Generuje HTML štítek.

Request body:
```json
{
  "trackingNumber": "DR2722082180C",
  "senderName": "Firma s.r.o.",
  "senderStreet": "Ulice 123",
  "senderZip": "11000",
  "senderCity": "Praha 1",
  "senderCountry": "Czech Republic",
  "recipientName": "Jan Novák",
  "recipientStreet": "Hlavní 456",
  "recipientZip": "12000",
  "recipientCity": "Praha 2",
  "recipientCountry": "Czech Republic",
  "pieces": "1",
  "weight": "0.5",
  "service": "Garantovaná doba dodání do 12:00hod"
}
```
