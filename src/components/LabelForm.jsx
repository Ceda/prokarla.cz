import { useState, useEffect } from 'react'
import './LabelForm.css'

function LabelForm({ onDataChange }) {
  const [trackingNumbers, setTrackingNumbers] = useState(['DR2722082281C'])
  const [formData, setFormData] = useState({
    senderName: '',
    senderStreet: '',
    senderCity: '',
    senderZip: '',
    senderPhone: '',
    senderPostOfficeZip: '',
    weight: '',
    recipientName: 'ProKarla.cz',
    recipientStreet: 'Bieblova 1202',
    recipientCity: 'Hradec Králové',
    recipientZip: '500 03',
    instructions: 'Odpovědní zásilku použijte k vracení nevhodného zboží z e-shopu ProKarla.cz.',
    footerText: 'Odpovědní zásilka - cenu hradí adresát'
  })

  const notify = (data, numbers) => {
    if (onDataChange) onDataChange({ ...data, trackingNumbers: numbers })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    notify(newData, trackingNumbers)
  }

  const updateTrackingNumber = (index, value) => {
    const newList = [...trackingNumbers]
    newList[index] = value
    setTrackingNumbers(newList)
    notify(formData, newList)
  }

  const addTrackingNumber = () => {
    const newList = [...trackingNumbers, '']
    setTrackingNumbers(newList)
    notify(formData, newList)
  }

  const removeTrackingNumber = (index) => {
    if (trackingNumbers.length === 1) return
    const newList = trackingNumbers.filter((_, i) => i !== index)
    setTrackingNumbers(newList)
    notify(formData, newList)
  }

  useEffect(() => {
    notify(formData, trackingNumbers)
  }, [])

  return (
    <div className="label-form-container">
      <div className="label-form">
        <div className="form-section">
          <h3>📦 Tracking čísla</h3>
          {trackingNumbers.map((tn, i) => (
            <div key={i} className="tracking-row">
              <span className="tracking-index">{i + 1}.</span>
              <input
                type="text"
                value={tn}
                onChange={(e) => updateTrackingNumber(i, e.target.value)}
                placeholder="DR2722082281C"
                className="form-input tracking-input"
              />
              {trackingNumbers.length > 1 && (
                <button
                  className="remove-btn"
                  onClick={() => removeTrackingNumber(i)}
                  title="Odebrat štítek"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button className="add-btn" onClick={addTrackingNumber}>
            + Přidat štítek
          </button>
        </div>

        <div className="form-section">
          <h3>📤 Odesílatel</h3>
          <div className="form-row">
            <label>Jméno</label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Vaše jméno"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label>Ulice a č. p.</label>
            <input
              type="text"
              name="senderStreet"
              value={formData.senderStreet}
              onChange={handleChange}
              placeholder="Ulice a číslo popisné"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label>Město</label>
            <input
              type="text"
              name="senderCity"
              value={formData.senderCity}
              onChange={handleChange}
              placeholder="Město"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label>PSČ</label>
            <input
              type="text"
              name="senderZip"
              value={formData.senderZip}
              onChange={handleChange}
              placeholder="123 45"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label>Váš telefon</label>
            <input
              type="text"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              placeholder="+420 xxx xxx xxx"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label>PSČ podací pošty</label>
            <input
              type="text"
              name="senderPostOfficeZip"
              value={formData.senderPostOfficeZip}
              onChange={handleChange}
              placeholder="PSČ podací pošty"
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label>Hmotnost (kg)</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="0.5"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section hidden">
          <h3>📥 Příjemce</h3>
          <div className="form-row">
            <label>Název firmy</label>
            <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} className="form-input" disabled />
          </div>
          <div className="form-row">
            <label>Ulice a č. p.</label>
            <input type="text" name="recipientStreet" value={formData.recipientStreet} onChange={handleChange} className="form-input" disabled />
          </div>
          <div className="form-row">
            <label>Město</label>
            <input type="text" name="recipientCity" value={formData.recipientCity} onChange={handleChange} className="form-input" disabled />
          </div>
          <div className="form-row">
            <label>PSČ</label>
            <input type="text" name="recipientZip" value={formData.recipientZip} onChange={handleChange} className="form-input" disabled />
          </div>
        </div>

        <div className="form-section hidden">
          <h3>📝 Další texty</h3>
          <div className="form-row">
            <label>Instrukce (vpravo nahoře)</label>
            <textarea name="instructions" value={formData.instructions} onChange={handleChange} className="form-input textarea" rows="2" disabled />
          </div>
          <div className="form-row">
            <label>Text v patičce</label>
            <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} className="form-input" disabled />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabelForm
