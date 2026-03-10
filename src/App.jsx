import { useState, useEffect } from 'react'
import LabelForm from './components/LabelForm'
import LabelPreview from './components/LabelPreview'
import PruvodkaForm from './components/PruvodkaForm'
import PruvodkaPreview from './components/PruvodkaPreview'
import HomePage from './components/HomePage'
import { generateBarcode } from './utils/barcode'
import { generateLabelHtml, generateMultiLabelPrintHtml } from './utils/labelTemplate'
import { downloadLabelPdf } from './utils/pdfExport'
import './App.css'

function App() {
  const [view, setView] = useState('home') // 'home' | 'label' | 'pruvodka'
  const [activeTab, setActiveTab] = useState('label') // 'label' | 'pruvodka'
  const [labelData, setLabelData] = useState(null)
  const [generatedHtmls, setGeneratedHtmls] = useState([])
  const [pruvodkaPages, setPruvodkaPages] = useState(null)
  const [showAbout, setShowAbout] = useState(false)
  const [generatingLabelPdf, setGeneratingLabelPdf] = useState(false)

  const navigate = (destination) => {
    setView(destination)
    setActiveTab(destination === 'pruvodka' ? 'pruvodka' : 'label')
  }

  useEffect(() => {
    if (activeTab === 'label' && labelData) {
      generateAllLabels(labelData)
    }
  }, [labelData, activeTab])

  const generateAllLabels = async (data) => {
    const trackingNumbers = data.trackingNumbers?.length ? data.trackingNumbers : ['']
    try {
      const htmls = await Promise.all(
        trackingNumbers.map(async (tn) => {
          const tracking = tn
          const barcodeDataUrl = await generateBarcode(tracking)
          return generateLabelHtml({ ...data, trackingNumber: tracking }, barcodeDataUrl)
        })
      )
      setGeneratedHtmls(htmls)
    } catch (err) {
      console.error('Error generating labels:', err)
    }
  }

  const handleLabelDownloadPdf = async () => {
    setGeneratingLabelPdf(true)
    try {
      await downloadLabelPdf(generatedHtmls)
    } finally {
      setGeneratingLabelPdf(false)
    }
  }

  const handleLabelPrint = () => {
    if (!generatedHtmls.length) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(generateMultiLabelPrintHtml(generatedHtmls))
    printWindow.document.close()
    printWindow.onload = () => {
      setTimeout(() => printWindow.print(), 250)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
        <div className="header-left">
          <button className="header-logo-btn" onClick={() => setView('home')}>
            <img src="/logo.png" alt="ProKarla.cz" className="header-logo" />
          </button>
          <span className="header-divider" />
          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'label' && view !== 'home' ? 'active' : ''}`}
              onClick={() => navigate('label')}
            >
              📦 Přepravní štítek
            </button>
            <button
              className={`tab ${activeTab === 'pruvodka' && view !== 'home' ? 'active' : ''}`}
              onClick={() => navigate('pruvodka')}
            >
              📋 <span className="tab-full">Průvodka vrácení zboží</span><span className="tab-short"> Průvodka</span>
            </button>
          </nav>
        </div>
        <button className="about-button" onClick={() => setShowAbout(true)}>
          ℹ️ O projektu
        </button>
        </div>
      </header>

      {view === 'home' && <HomePage onNavigate={navigate} />}

      <div className="app-content" style={{ display: view === 'home' ? 'none' : undefined }}>
        {activeTab === 'pruvodka' ? (
          <div className="label-container">
            <div className="label-editor">
              <h1>📋 Průvodka vrácení zboží</h1>
              <PruvodkaForm onDataChange={setPruvodkaPages} />
            </div>

            {pruvodkaPages && (
              <PruvodkaPreview pages={pruvodkaPages} />
            )}
          </div>
        ) : (
          <div className="label-container">
            <div className="label-editor">
              <h1>📦 Přepravní štítek</h1>
              <LabelForm onDataChange={setLabelData} />
            </div>

            {generatedHtmls.length > 0 && (
              <div className="preview-section">
                <div className="preview-header">
                  <h2>Náhled štítků ({generatedHtmls.length})</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="print-button"
                      onClick={handleLabelPrint}
                    >
                      🖨️ Tisk
                    </button>
                    <button
                      className="print-button"
                      style={{ background: '#0066cc' }}
                      onClick={handleLabelDownloadPdf}
                      disabled={generatingLabelPdf}
                    >
                      {generatingLabelPdf ? '⏳ Generuji...' : '📥 Stáhnout PDF'}
                    </button>
                  </div>
                </div>
                <LabelPreview htmls={generatedHtmls} />
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Created by </span>
        <a href="https://blog.antoninpleskac.cz/" target="_blank" rel="noopener noreferrer">
          Antonín Pleskač
        </a>
        <a href="https://github.com/Ceda/prokarla.cz" target="_blank" rel="noopener noreferrer" className="footer-github" aria-label="GitHub">
          <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </footer>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAbout(false)}>✕</button>
            <h2>O projektu</h2>

            <div className="about-section">
              <h3>🎯 Proč tento projekt vznikl?</h3>
              <p>
                V rámci procesu vrácení zboží v e-shopu ProKarla.cz bylo nutné, aby zákazníci vyplnili
                doprovázející dokumenty. Původní proces pomocí DOCX nebo PDF šablon byl pro zákazníky
                velmi nepohodlný a vyžadoval náročné úpravy.
              </p>
              <p><strong>Problém:</strong> Zákazníci neměli pohodlný způsob, jak vyplnit potřebné údaje
              a vytisknout dokumenty v přijatelné kvalitě.
              </p>
            </div>

            <div className="about-section">
              <h3>📋 Průvodka vrácení zboží</h3>
              <p>
                Průvodka je dokument, který musí zákazník vyplnit při vracení zboží.
                Obsahuje seznam vrácených položek s kódy zboží a názvy.
              </p>
              <p><strong>Původní řešení:</strong></p>
              <ul>
                <li>Zákazník dostal DOCX nebo PDF soubor</li>
                <li>Musel mít nainstalovaný MS Word nebo podobný software</li>
                <li>Nebo vše vypisovat ručně na papír</li>
              </ul>
              <p><strong>Nové řešení:</strong></p>
              <ul>
                <li>Vyplnění formuláře přímo v prohlížeči - není potřeba žádný software</li>
                <li>Okamžitý náhled dokumentu</li>
                <li>Tisk přímo z prohlížeče nebo uložení jako PDF</li>
                <li>Automatické generování kódů zboží, názvů a čísel objednávek</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>📦 Přepravní štítek pro podací poštu</h3>
              <p>
                Pro zaslání vráceného zboží je nutné vytvořit odpovědní zásilku s přepravním šítkem.
                Štítek obsahuje údaje odesílatele (zákazníka), příjemce (e-shopu), čárový kód
                a další náležitosti podle požadavků České pošty.
              </p>
              <p><strong>Původní řešení:</strong></p>
              <ul>
                <li>Ruční vypisování údaje do PDF šablony</li>
                <li>Vytváření dokumentů v komplexních textových editorech</li>
                <li>Riziko chyb při přepisování údajů</li>
              </ul>
              <p><strong>Nové řešení:</strong></p>
              <ul>
                <li>Vyplnění formuláře s údaji odesílatele</li>
                <li>Automatické generování čárového kódu (barcode)</li>
                <li>Přesný formát A6 (148 × 105 mm) pro Českou poštu</li>
                <li>Vložení loga e-shopu do štítku</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>⚠️ Hlavní problém: ztráta diakritiky při tisku</h3>
              <p>
                <strong>Největší problém</strong> byla ztráta českých znaků (diakritiky) při tisku
                z PDF souborů nebo přímo z webových stránek. Projevuje se to takto:
              </p>
              <ul>
                <li>Známě <strong>ěščřžžýáíé</strong> za <strong>escrzzyai</strong> nebo jiné znaky</li>
                <li>Projev je náhodný a závisí na kombinaci prohlížeče a tiskárny</li>
                <li>Nelze spolehnout na automatický tisk - vždy je nutná kontrola</li>
              </ul>
              <p>
                <strong>Složitý proces nápravy:</strong>
              </p>
              <ol>
                <li>Otevřít PDF v editoru a anotovat problémové znaky</li>
                <li>Převést do formátu, který si zachová písmena</li>
                <li>Někdy nutnost převést dokument do obrázku</li>
                <li>A teprve poté tisknout</li>
              </ol>
              <p>
                <strong>Řešení v tomto nástroji:</strong>
              </p>
              <ul>
                <li>Dokumenty jsou generovány přímo v HTML/CSS</li>
                <li>Při tisku se používají `@media print` CSS pravidla</li>
                <li>Diakritika je zajištěna použitím UTF-8 a správných fontů</li>
                <li>Tisk probíhá přímo z prohlížeče bez ztráty znaků</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>💻 Technické řešení</h3>
              <p><strong>Frontend:</strong></p>
              <ul>
                <li>React 18 s Vite pro rychlý vývoj</li>
                <li>Generování čárových kódů pomocí JsBarcode</li>
                <li>Responzivní design pro desktop i mobilní zařízení</li>
                <li>Tisk ve formátu A6 (štítek) a A4 (průvodka)</li>
              </ul>
              <p><strong>Formáty dokumentů:</strong></p>
              <ul>
                <li>Přepravní štítek: A6 landscape (148 × 105 mm)</li>
                <li>Průvodka: A4 (210 × 297 mm)</li>
                <li>Podpora pro tisk na běžných tiskárnách</li>
              </ul>
              <p><strong>Vlastnosti:</strong></p>
              <ul>
                <li>Okamžitý náhled vyplněného dokumentu</li>
                <li>Možnost uložit jako PDF (při tisku "Uložit jako PDF")</li>
                <li>Automatické generování čárových kódů</li>
                <li>Vložení loga ProKarla.cz</li>
                <li>Vše běží v prohlížeči - není potřeba instalace</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>🚀 Jak nástroj používáte?</h3>
              <p><strong>Pro vytvoření přepravního štítku:</strong></p>
              <ol>
                <li>Vyplňte údaje odesílatele (vaše jméno, adresa, telefon)</li>
                <li>Vyplňte hmotnost zásilky</li>
                <li>V náhledu zkontrolujte správnost údajů</li>
                <li>Klikněte na "Tisk" a vytiskněte štítek</li>
              </ol>
              <p><strong>Pro vytvoření průvodky:</strong></p>
              <ol>
                <li>Vyplňte čísla objednávek (např. 971234567)</li>
                <li>Pro každou objednávku vyplňte kódy zboží (např. RID12345)</li>
                <li>Nepovinné: vyplňte názvy produktů</li>
                <li>Z náhledu zkontrolujte dokument</li>
                <li>Klikněte na "Tisk průvodky"</li>
              </ol>
            </div>

            <div className="about-section">
              <h3>📌 Užitečné tipy</h3>
              <ul>
                <li><strong>Tisk do PDF:</strong> V tiskovém dialogu vyberte "Uložit jako PDF" místo tiskárny</li>
                <li><strong>Náhled:</strong> Vše se zobrazuje v reálném čase při vyplňování</li>
                <li><strong>Čárové kódy:</strong> Generují se automaticky podle čísla zásilky</li>
                <li><strong>Hmotnost:</strong> Zadejte hmotnost v kg, např. 0.5 pro půl kila</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
