import './HomePage.css'

export default function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-hero">
        <img src="/logo.png" alt="ProKarla.cz" className="home-logo" />
        <p className="home-tagline">Generátor přepravních dokladů pro vrácení zboží</p>
        <p className="home-subtitle">
          Bez Wordu, bez PDF šablon, bez ztráty diakritiky. Dokumenty pro vrácení zboží rovnou v prohlížeči.
          Podporuje hromadné vystavení — více štítků i průvodek najednou.
        </p>
      </div>

      <div className="home-cards">
        <button className="home-card" onClick={() => onNavigate('label')}>
          <div className="home-card-header">
            <div className="home-card-icon">📦</div>
            <h2 className="home-card-title">Přepravní štítek</h2>
          </div>
          <p className="home-card-desc">
            Vytvořte štítek formátu A6 pro Českou poštu s automaticky generovaným čárovým kódem.
          </p>
          <ul className="home-card-features">
            <li>Tisk na A4 — více štítků na jeden list</li>
            <li>Automatický čárový kód</li>
            <li>Údaje odesílatele i příjemce</li>
          </ul>
          <span className="home-card-action">Vytvořit štítek →</span>
        </button>

        <button className="home-card" onClick={() => onNavigate('pruvodka')}>
          <div className="home-card-header">
            <div className="home-card-icon">📋</div>
            <h2 className="home-card-title">Průvodka vrácení</h2>
          </div>
          <p className="home-card-desc">
            Sestavte průvodní dokument k vráceným položkám s kódy zboží a čísly objednávek.
          </p>
          <ul className="home-card-features">
            <li>Formát A4 pro tisk</li>
            <li>Více objednávek a průvodek najednou</li>
            <li>Automatické kódy zboží</li>
          </ul>
          <span className="home-card-action">Vytvořit průvodku →</span>
        </button>
      </div>

      <div className="home-problem">
        <h3 className="home-problem-title">Proč tento nástroj vznikl?</h3>
        <div className="home-problem-cols">
          <div className="home-problem-col home-problem-before">
            <div className="home-problem-label">Dříve</div>
            <ul>
              <li>Zákazník dostal DOCX nebo PDF šablonu</li>
              <li>Musel mít nainstalovaný MS Word nebo podobný software</li>
              <li>Nebo vše vypisoval ručně na papír</li>
              <li>Při tisku z PDF se ztrácela česká diakritika</li>
            </ul>
          </div>
          <div className="home-problem-arrow">→</div>
          <div className="home-problem-col home-problem-after">
            <div className="home-problem-label">Nyní</div>
            <ul>
              <li>Vše vyplníte přímo v prohlížeči — bez instalace</li>
              <li>Okamžitý náhled dokumentu v reálném čase</li>
              <li>Tisk nebo uložení jako PDF jedním kliknutím</li>
              <li>Česká diakritika funguje spolehlivě vždy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="home-feature">
          <span className="home-feature-icon">🌐</span>
          <span>Vše přímo v prohlížeči — žádná instalace</span>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon">⚡</span>
          <span>Náhled dokumentu v reálném čase</span>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon">🖨️</span>
          <span>Tisk nebo uložení jako PDF</span>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon">🔤</span>
          <span>Správná česká diakritika při tisku</span>
        </div>
      </div>
    </div>
  )
}
