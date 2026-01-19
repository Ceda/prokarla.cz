import { useState, useEffect } from 'react'
import './PruvodkaForm.css'

const emptyOrders = () => [
  { id: 1, orderNumber: '', items: Array(5).fill(null).map(() => ({ code: '', name: '' })) },
  { id: 2, orderNumber: '', items: Array(5).fill(null).map(() => ({ code: '', name: '' })) },
  { id: 3, orderNumber: '', items: Array(5).fill(null).map(() => ({ code: '', name: '' })) },
]

let nextPageId = 1

function PruvodkaForm({ onDataChange }) {
  const [pages, setPages] = useState([{ id: nextPageId++, orders: emptyOrders() }])

  useEffect(() => {
    if (onDataChange) onDataChange(pages)
  }, [pages, onDataChange])

  const handleOrderNumberChange = (pageId, orderId, value) => {
    setPages(pages.map(page =>
      page.id !== pageId ? page : {
        ...page,
        orders: page.orders.map(order =>
          order.id === orderId ? { ...order, orderNumber: value } : order
        )
      }
    ))
  }

  const handleItemChange = (pageId, orderId, itemIndex, field, value) => {
    setPages(pages.map(page =>
      page.id !== pageId ? page : {
        ...page,
        orders: page.orders.map(order => {
          if (order.id !== orderId) return order
          const newItems = [...order.items]
          newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }
          return { ...order, items: newItems }
        })
      }
    ))
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
              <h3>Objednávka #{orderIndex + 1}</h3>
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
                      <th width="10%">#</th>
                      <th width="30%">Kód zboží</th>
                      <th width="60%">Název zboží</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}

      <button className="add-page-btn" onClick={addPage}>
        + Přidat průvodku
      </button>
    </>
  )
}

export default PruvodkaForm
