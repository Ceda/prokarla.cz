import { useState } from 'react'
import { downloadPruvodkaPdf } from '../utils/pdfExport'
import './PruvodkaForm.css'

function PageContent({ orders }) {
  return (
    <>
      <div className="header-section">
        <img src="/logo.png" alt="ProKarla.cz" className="logo-img" />
        <div className="title-text">Průvodka vrácení zboží</div>
      </div>

      <div className="address-line">
        <span className="address-label">Adresa pro zaslání zboží: </span>
        <span className="address-bold">OdKarla, </span>
        <span className="address-bold">Bieblova 1202, </span>
        <span className="address-bold">500 03 Hradec Králové</span>
      </div>

      <div className="important-line">
        DŮLEŽITÉ! Průvodku prosím vyplňte co nejpřesněji a přiložte k vrácenému zboží.
      </div>
      <div className="instruction-line">
        Výrazně to pomůže při identifikaci a zpracování vráceného zboží a zrychlí to vyřízení vašeho případu 🙂
      </div>
      <div className="fill-line">
        Zde prosím vyplňte všechny vrácené kusy a čísla objednávek, ze kterých pochází:
      </div>

      {orders.map((order) => (
        <div key={order.id} className="order-block">
          <div className="order-number-line">
            Číslo objednávky:{' '}
            {order.orderNumber || (
              <span className="order-number-dots">…………………………………….</span>
            )}
          </div>

          <div className="table-header">
            <div className="col-code">Kód zboží</div>
            <div className="col-name">Název zboží</div>
          </div>

          {[0, 1, 2, 3, 4].map((itemIndex) => {
            const item = order.items[itemIndex]
            return (
              <div key={itemIndex} className="table-row">
                <div className="row-num">{itemIndex + 1}.</div>
                <div className="row-code">
                  {item?.code || <span className="dots">…………………………………………….</span>}
                </div>
                <div className="row-name">
                  {item?.name || <span className="dots">……………………………………………………………………………..…………………..</span>}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}

function PruvodkaPreview({ pages }) {
  const [generating, setGenerating] = useState(false)

  const handleDownloadPdf = async () => {
    setGenerating(true)
    try {
      await downloadPruvodkaPdf()
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = () => {
    const printContent = document.getElementById('pruvodka-print-content')
    if (!printContent) return

    // Build absolute URL for logo so it resolves in the new window
    const logoUrl = window.location.origin + '/logo.png'

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="cs">
      <head>
        <meta charset="UTF-8">
        <title>Průvodka vrácení zboží</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          @page {
            size: A4;
            margin: 0;
          }

          body {
            font-family: Roboto, 'Times New Roman', Arial, sans-serif;
            color: #333333;
            line-height: 1.2;
            font-size: 11pt;
          }

          .pruvodka-page {
            max-width: 210mm;
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            page-break-after: always;
            break-after: page;
          }

          .pruvodka-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }

          .header-section {
            position: relative;
            margin-bottom: 8mm;
            min-height: 30mm;
          }

          .logo-img {
            position: absolute;
            top: -2mm;
            right: 0;
            width: 55mm;
            height: auto;
          }

          .title-text {
            font-size: 30pt;
            font-weight: bold;
            padding-right: 60mm;
          }

          .address-line {
            font-size: 11pt;
            margin-bottom: 2mm;
          }

          .address-label { font-weight: normal; }
          .address-bold { font-weight: bold; }

          .important-line {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 2mm;
          }

          .instruction-line {
            font-size: 11pt;
            margin-bottom: 2mm;
          }

          .fill-line {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 6mm;
            margin-bottom: 3mm;
          }

          .order-block {
            margin-bottom: 5mm;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .order-number-line {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 3mm;
          }

          .order-number-dots { color: #999; font-weight: normal; }

          .table-header {
            display: flex;
            padding-left: 4mm;
            margin-bottom: 2mm;
          }

          .col-code { width: 35%; margin-left: 5%; font-size: 11pt; font-weight: bold; }
          .col-name { width: 60%; font-size: 11pt; font-weight: bold; }

          .table-row {
            display: flex;
            padding-left: 4mm;
            margin-bottom: 2mm;
          }

          .row-num  { width: 5%;  font-size: 11pt; font-weight: bold; }
          .row-code { width: 35%; font-size: 11pt; }
          .row-name { width: 60%; font-size: 11pt; }

          .dots { color: #999; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML.replace(/src="\/logo\.png"/g, `src="${logoUrl}"`)}
      </body>
      </html>
    `)
    printWindow.document.close()

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  if (!pages?.length) return null

  return (
    <div className="preview-section">
      <div className="preview-header">
        <h2>Náhled průvodky</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="print-button" onClick={handlePrint}>
            🖨️ Tisk
          </button>
          <button
            className="print-button"
            style={{ background: '#0066cc' }}
            onClick={handleDownloadPdf}
            disabled={generating}
          >
            {generating ? '⏳ Generuji...' : '📥 Stáhnout PDF'}
          </button>
        </div>
      </div>

      {/* Screen view — pages separated by dividers */}
      {pages.map((page, pageIndex) => (
        <div key={page.id}>
          {pages.length > 1 && (
            <div className="page-divider-screen">
              Průvodka {pageIndex + 1}
            </div>
          )}
          <div className="pruvodka-page">
            <PageContent orders={page.orders} />
          </div>
        </div>
      ))}

      {/*
        Hidden print content: .pruvodka-page elements are direct children
        so .pruvodka-page:last-child selector works correctly for page breaks.
      */}
      <div id="pruvodka-print-content" style={{ display: 'none' }}>
        {pages.map((page) => (
          <div key={page.id} className="pruvodka-page">
            <PageContent orders={page.orders} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PruvodkaPreview
