import { useState, useEffect } from 'react'
import './PruvodkaForm.css'

const MIN_ITEMS = 5

const emptyOrders = () => [
  { id: 1, orderNumber: '', items: Array(MIN_ITEMS).fill(null).map(() => ({ code: '', name: '' })) },
  { id: 2, orderNumber: '', items: Array(MIN_ITEMS).fill(null).map(() => ({ code: '', name: '' })) },
  { id: 3, orderNumber: '', items: Array(MIN_ITEMS).fill(null).map(() => ({ code: '', name: '' })) },
]

let nextPageId = 1

function parseOrderItems(text) {
  const lines = text.split('\n').map(l => l.trim())
  const items = []
  let i = 0
  while (i < lines.length) {
    if (/^Položky objednávky$/i.test(lines[i]) || /^\d{1,3}$/.test(lines[i])) { i++; continue }
    if (lines[i] === '') { i++; continue }
    if (/^RID\d+/.test(lines[i]) || /^\d{8,}$/.test(lines[i])) {
      const code = lines[i]
      const name = lines[i + 1] && !/^\d+$/.test(lines[i + 1]) ? lines[i + 1] : ''
      items.push({ code, name })
      i += name ? 2 : 1
    } else {
      i++
    }
  }
  return items
}

function updateOrder(pages, pageId, orderId, updater) {
  return pages.map(page =>
    page.id !== pageId ? page : {
      ...page,
      orders: page.orders.map(order =>
        order.id !== orderId ? order : updater(order)
      )
    }
  )
}

function PruvodkaForm({ onDataChange }) {
  const [pages, setPages] = useState([{ id: nextPageId++, orders: emptyOrders() }])
  const [dialog, setDialog] = useState(null) // { pageId, orderId }
  const [orderText, setOrderText] = useState('')

  useEffect(() => {
    if (onDataChange) onDataChange(pages)
  }, [pages, onDataChange])

  const handleOrderNumberChange = (pageId, orderId, value) => {
    setPages(updateOrder(pages, pageId, orderId, order => ({ ...order, orderNumber: value })))
  }

  const handleItemChange = (pageId, orderId, itemIndex, field, value) => {
    setPages(updateOrder(pages, pageId, orderId, order => {
      const newItems = [...order.items]
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }
      return { ...order, items: newItems }
    }))
  }

  const addItem = (pageId, orderId) => {
    setPages(updateOrder(pages, pageId, orderId, order => ({
      ...order,
      items: [...order.items, { code: '', name: '' }]
    })))
  }

  const removeItem = (pageId, orderId, itemIndex) => {
    setPages(updateOrder(pages, pageId, orderId, order => ({
      ...order,
      items: order.items.filter((_, i) => i !== itemIndex)
    })))
  }

  const confirmParseOrder = () => {
    if (!dialog) return
    const parsed = parseOrderItems(orderText)
    if (parsed.length === 0) return
    setPages(updateOrder(pages, dialog.pageId, dialog.orderId, order => {
      const newItems = parsed.map(p => ({ code: p.code, name: p.name }))
      // pad to MIN_ITEMS if fewer parsed
      while (newItems.length < MIN_ITEMS) newItems.push({ code: '', name: '' })
      return { ...order, items: newItems }
    }))
    setDialog(null)
    setOrderText('')
  }

  const addPage = () => {
    setPages([...pages, { id: nextPageId++, orders: emptyOrders() }])
  }

  const removePage = (pageId) => {
    if (pages.length === 1) return
    setPages(pages.filter(p => p.id !== pageId))
  }

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div key={page.id}>
          {pages.length > 1 && (
            <div className="page-header-row">
              <span className="page-label">Průvodka {pageIndex + 1}</span>
              <button
                className="remove-page-btn"
                onClick={() => removePage(page.id)}
                title="Odebrat průvodku"
              >
                ✕ Odebrat
              </button>
            </div>
          )}

          {page.orders.map((order, orderIndex) => (
            <div key={order.id} className="label-form">
              <div className="order-header-row">
                <h3>Objednávka #{orderIndex + 1}</h3>
                <button
                  className="parse-order-btn"
                  onClick={() => { setDialog({ pageId: page.id, orderId: order.id }); setOrderText('') }}
                >
                  📋 Načíst z objednávky
                </button>
              </div>
              <div className="form-row">
                <label>Číslo objednávky:</label>
                <input
                  type="text"
                  value={order.orderNumber}
                  onChange={(e) => handleOrderNumberChange(page.id, order.id, e.target.value)}
                  placeholder="např. 971234567"
                  className="form-input"
                />
              </div>

              <table className="items-table">
                {orderIndex === 0 && (
                  <thead>
                    <tr>
                      <th width="8%">#</th>
                      <th width="28%">Kód zboží</th>
                      <th>Název zboží</th>
                      <th width="32px"></th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {order.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>{itemIndex + 1}.</td>
                      <td>
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) => handleItemChange(page.id, order.id, itemIndex, 'code', e.target.value)}
                          placeholder="Kód"
                          className="table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(page.id, order.id, itemIndex, 'name', e.target.value)}
                          placeholder="Název"
                          className="table-input"
                        />
                      </td>
                      <td>
                        {order.items.length > MIN_ITEMS && (
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItem(page.id, order.id, itemIndex)}
                            title="Odebrat řádek"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="add-item-btn" onClick={() => addItem(page.id, order.id)}>
                + Přidat řádek
              </button>
            </div>
          ))}
        </div>
      ))}

      <button className="add-page-btn" onClick={addPage}>
        + Přidat průvodku
      </button>

      {dialog && (
        <div className="order-dialog-overlay" onClick={() => setDialog(null)}>
          <div className="order-dialog" onClick={e => e.stopPropagation()}>
            <h3>📋 Načíst z objednávky</h3>
            <ol className="order-dialog-steps">
              <li>Otevři své objednávky a rozklikni detail objednávky</li>
              <li>Najdi sekci <strong>Položky objednávky</strong></li>
              <li>Zkopíruj položky, které chceš přenést, a vlož je sem</li>
            </ol>
            <textarea
              className="order-dialog-textarea"
              value={orderText}
              onChange={e => setOrderText(e.target.value)}
              placeholder={"Položky objednávky\n1\n\n103000001912226\nUšní teploměr Braun IRT6520\n..."}
              rows={12}
              autoFocus
            />
            <div className="order-dialog-actions">
              <button className="order-dialog-cancel" onClick={() => setDialog(null)}>Zrušit</button>
              <button className="order-dialog-confirm" onClick={confirmParseOrder}>Načíst</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PruvodkaForm
