import { useState } from 'react'
import { getProductByBarcode, registerSale } from '../api/index'
import BarcodeScanner from '../components/BarcodeScanner'

function Sales() {
  const [barcode, setBarcode] = useState('')
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const handleAddToCart = async () => {
    if (!barcode) return
    try {
      const res = await getProductByBarcode(barcode)
      const p = res.data
      const existing = cart.find(i => i.barcode === barcode)
      if (existing) {
        setCart(cart.map(i => i.barcode === barcode ? { ...i, quantity: i.quantity + 1 } : i))
      } else {
        setCart([...cart, { barcode: p.barcode, name: p.name, sell_price: p.sell_price, quantity: 1 }])
      }
      setBarcode('')
      setMessage('')
    } catch {
      setMessage('❌ محصول پیدا نشد')
    }
  }

  const handleRemove = (barcode) => {
    setCart(cart.filter(i => i.barcode !== barcode))
  }

  const total = cart.reduce((sum, i) => sum + i.sell_price * i.quantity, 0)

  const handleSale = async () => {
    if (cart.length === 0) return
    try {
      await registerSale({ items: cart.map(i => ({ barcode: i.barcode, quantity: i.quantity })) })
      setMessage('✅ فروش ثبت شد — مبلغ: ' + total.toLocaleString() + ' تومان')
      setCart([])
    } catch (e) {
      setMessage('❌ ' + (e.response?.data?.detail || 'خطا'))
    }
  }

  const inputStyle = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }
  const btnStyle = (color) => ({ padding: '0.5rem 1rem', background: color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' })

  return (
    <div style={{ padding: '1rem', direction: 'rtl' }}>
      <h2>🛒 فروش</h2>

       {showScanner && <BarcodeScanner onScan={(code) => { setBarcode(code); setShowScanner(false) }} onClose={() => setShowScanner(false)} />}

      <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <p style={{ color: '#64748b' }}>بارکد محصول رو بخون یا وارد کن</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            placeholder="بارکد"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddToCart()}
            style={{ ...inputStyle, width: '250px' }}
            autoFocus
          />
          <button onClick={handleAddToCart} style={btnStyle('#3b82f6')}>اضافه به سبد</button>
          <button onClick={() => setShowScanner(true)} style={btnStyle('#8b5cf6')}>📷 اسکن</button>
        </div>
      </div>

      {cart.length > 0 && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: 'white' }}>
                <th style={{ padding: '0.5rem' }}>نام</th>
                <th style={{ padding: '0.5rem' }}>تعداد</th>
                <th style={{ padding: '0.5rem' }}>قیمت واحد</th>
                <th style={{ padding: '0.5rem' }}>جمع</th>
                <th style={{ padding: '0.5rem' }}>حذف</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(i => (
                <tr key={i.barcode} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <td style={{ padding: '0.5rem' }}>{i.name}</td>
                  <td style={{ padding: '0.5rem' }}>{i.quantity}</td>
                  <td style={{ padding: '0.5rem' }}>{i.sell_price.toLocaleString()}</td>
                  <td style={{ padding: '0.5rem' }}>{(i.sell_price * i.quantity).toLocaleString()}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button onClick={() => handleRemove(i.barcode)} style={btnStyle('#ef4444')}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '1rem', borderRadius: '8px' }}>
            <h3>جمع کل: {total.toLocaleString()} تومان</h3>
            <button onClick={handleSale} style={{ ...btnStyle('#16a34a'), fontSize: '1rem', padding: '0.75rem 2rem' }}>ثبت فروش</button>
          </div>
        </div>
      )}

      {message && <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1rem' }}>{message}</p>}
    </div>
  )
}

export default Sales