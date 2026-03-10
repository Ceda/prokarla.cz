/**
 * Generate shipping label HTML with barcode
 */
export const generateLabelHtml = (data, barcodeDataUrl) => {
  const {
    trackingNumber,
    senderName,
    senderStreet,
    senderCity,
    senderZip,
    senderPhone,
    senderPostOfficeZip,
    weight,
    recipientName,
    recipientStreet,
    recipientCity,
    recipientZip,
    instructions,
    footerText
  } = data

  const tracking = trackingNumber || ''

  return `
    <div class="label">
      <!-- Top Row - 2 Columns -->
      <div class="top-row">
        <div class="ceska-posta">Česká pošta</div>
        <div class="top-instructions">
          <div>${instructions || 'Odpovědní zásilku použijte k vracení nevhodného zboží z e-shopu OdKarla.cz.'}</div>
          <div>Tato zásilka je pro vás zdarma.</div>
        </div>
      </div>

      <!-- Middle Section - 2 Columns -->
      <div class="middle-section">
        <!-- Column 1 - Sender -->
        <div class="sender-column">
          <div class="sender-title">ODESÍLATEL</div>

          <div class="sender-field">
            <span class="sender-field-label">Jméno:</span>
            <span class="sender-field-value">${senderName || ''}</span>
          </div>

          <div class="sender-field">
            <span class="sender-field-label">Ulice a č. p.:</span>
            <span class="sender-field-value">${senderStreet || ''}</span>
          </div>

          <div class="sender-field">
            <span class="sender-field-label">Město:</span>
            <span class="sender-field-value">${senderCity || ''}</span>
          </div>

          <div class="sender-field">
            <span class="sender-field-label">PSČ:</span>
            <span class="sender-field-value">${senderZip || ''}</span>
          </div>

          <div class="sender-field">
            <span class="sender-field-label">Váš telefon:</span>
            <span class="sender-field-value">${senderPhone || ''}</span>
          </div>

          <div class="sender-field sender-field-spacer">
            <span class="sender-field-label">PSČ podací pošty:</span>
            <span class="sender-field-value">${senderPostOfficeZip || ''}</span>
          </div>

          <div class="sender-field">
            <span class="sender-field-label">Hmotnost:</span>
            <span class="sender-field-value">${weight || ''}</span>
            <span class="sender-field-unit">kg</span>
          </div>
        </div>

        <!-- Column 2 - Barcode, ODPOVEDNI box, Recipient -->
        <div class="right-column">
          <div class="barcode-section">
            <div class="dr-label">DR</div>
            <div class="barcode-wrapper">
              ${barcodeDataUrl ? `<img src="${barcodeDataUrl}" alt="Barcode" class="barcode-img">` : ''}
              <div class="tracking-number">${tracking}</div>
            </div>
          </div>

          <div class="odovedni-box">
            <div class="odovedni-left">ODPOVEDNI</div>
            <div class="odovedni-right">D + 1</div>
          </div>

          <div class="recipient-section">
            <div class="recipient-name">${recipientName || 'ProKarla.cz'}</div>
            <div class="recipient-line">${recipientStreet || 'Bieblova 1202'}</div>
            <div class="recipient-line">${recipientCity || 'Hradec Králové'}</div>
            <div class="recipient-line">${recipientZip || '500 03'}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        ${footerText || 'Odpovědní zásilka - cenu hradí adresát'}
      </div>
    </div>
  `
}

/**
 * Generate complete HTML document for printing labels arranged 4-up on A4 landscape (2×2 grid).
 * A6 landscape (148×105mm) fits exactly 2×2 on A4 landscape (297×210mm).
 * @param {string|string[]} labelHtmls
 */
export const generateMultiLabelPrintHtml = (labelHtmls) => {
  const htmlArray = Array.isArray(labelHtmls) ? labelHtmls : [labelHtmls]

  // Group into pages of 4
  const pages = []
  for (let i = 0; i < htmlArray.length; i += 4) {
    pages.push(htmlArray.slice(i, i + 4))
  }

  const body = pages.map((page) => `
    <div class="label-page">
      ${page.map((html) => `<div class="label-document">${html}</div>`).join('\n')}
    </div>
  `).join('\n')

  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <title>Přepravní štítky</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: #fff;
    }

    /* A4 landscape page: 297×210mm — holds 2×2 A6 labels (2×148=296mm, 2×105=210mm) */
    .label-page {
      width: 296mm;
      height: 210mm;
      display: grid;
      grid-template-columns: 148mm 148mm;
      grid-template-rows: 105mm 105mm;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
    }

    .label-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }

    .label-document {
      font-family: Arial, sans-serif;
      background: #fff;
      width: 148mm;
      height: 105mm;
      padding: 5mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      overflow: hidden;
    }

    .label {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      border: 2px dashed #000;
      padding: 3mm;
    }

    .top-row {
      display: grid;
      grid-template-columns: 50% 50%;
      align-items: flex-start;
      margin-bottom: 2mm;
    }

    .ceska-posta {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #000;
    }

    .top-instructions {
      font-size: 6pt;
      color: #000;
      line-height: 1.3;
      text-align: left;
    }

    .top-instructions div { display: inline; }

    .middle-section {
      display: grid;
      grid-template-columns: 50% 50%;
      flex: 1;
    }

    .sender-column { padding-right: 2mm; }

    .sender-title {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 3mm;
      color: #000;
    }

    .sender-field {
      margin-bottom: 2mm;
      display: flex;
      align-items: baseline;
    }

    .sender-field-label {
      font-weight: bold;
      font-size: 7pt;
      margin-right: 1mm;
      white-space: nowrap;
      min-width: 25mm;
    }

    .sender-field-value {
      font-size: 7pt;
      border-bottom: 1px dotted #999;
      flex: 1;
      min-height: 3mm;
    }

    .sender-field-unit {
      font-size: 7pt;
      margin-left: 1mm;
      white-space: nowrap;
    }

    .sender-field-spacer { margin-top: 5mm; }

    .right-column {
      padding-left: 2mm;
      display: flex;
      flex-direction: column;
    }

    .barcode-section {
      display: flex;
      align-items: center;
      gap: 2mm;
      margin-bottom: 2mm;
    }

    .dr-label {
      font-size: 18pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #000;
      flex-shrink: 0;
      margin: 0;
      padding: 0;
    }

    .barcode-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin: 0;
      padding: 0;
    }

    .barcode-img {
      width: auto;
      max-width: 55mm;
      height: 8mm;
      object-fit: contain;
      display: block;
    }

    .tracking-number {
      font-size: 9pt;
      text-align: center;
      font-weight: bold;
      margin-top: 0.5mm;
    }

    .odovedni-box {
      width: 100%;
      max-width: 60mm;
      height: 12mm;
      border: 1mm solid #000;
      display: flex;
      margin-bottom: 3mm;
    }

    .odovedni-left {
      flex: 1;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      border-right: 1mm solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .odovedni-right {
      flex: 1;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .recipient-section { flex: 1; }

    .recipient-name {
      font-size: 9pt;
      font-weight: bold;
      margin-bottom: 2mm;
      color: #000;
    }

    .recipient-line {
      font-size: 9pt;
      margin-bottom: 2mm;
      color: #000;
    }

    .footer {
      text-align: center;
      font-size: 6pt;
      color: #000;
      padding-top: 2mm;
    }

    @media print {
      body { margin: 0; padding: 0; }
    }
  </style>
</head>
<body>
  ${body}
</body>
</html>`
}
