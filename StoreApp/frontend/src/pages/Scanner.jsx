import { useState } from 'react'
import { getProductByBarcode, createProduct, addToInventory } from '../api/index'
import BarcodeScanner from '../components/BarcodeScanner'

function Scanner() {
  const [barcode, setBarcode] = useState('')
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [newProduct, setNewProduct] = useState({ name: '', buy_price: '', sell_price: '' })
  const [mode, setMode] = useState('') // 'found' | 'new'
  const [message, setMessage] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  const handleSearch = async () => {
    if (!barcode) return
    try {
      const res = await getProductByBarcode(barcode)
      setProduct(res.data)
      setMode('found')
      setMessage('')
    } catch {
      setMode('new')
      setMessage('محصول پیدا نشد — اطلاعات رو وارد کن')
    }
  }

  const handleAddStock = async () => {
    try {
      await addToInventory({ barcode, quantity: Number(quantity), note: 'دریافت کالا' })
      setMessage('✅ موجودی اضافه شد')
      setBarcode('')
      setProduct(null)
      setMode('')
    } catch (e) {
      setMessage('❌ ' + (e.response?.data?.detail || 'خطا'))
    }
  }

  const handleCreateAndAdd = async () => {
    try {
      await createProduct({ barcode, name: newProduct.name, buy_price: Number(newProduct.buy_price), sell_price: Number(newProduct.sell_price), quantity: 0 })
      await addToInventory({ barcode, quantity: Number(quantity), note: 'دریافت کالا' })
      setMessage('✅ محصول ثبت و موجودی اضافه شد')
      setBarcode('')
      setNewProduct({ name: '', buy_price: '', sell_price: '' })
      setMode('')
    } catch (e) {
      setMessage('❌ ' + (e.response?.data?.detail || 'خطا'))
    }
  }

  const inputStyle = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }
  const btnStyle = (color) => ({ padding: '0.5rem 1rem', background: color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' })

  return (
    <div style={{ padding: '1rem', direction: 'rtl' }}>
      <h2>📷 دریافت کالا</h2>

      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

      <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="بارکد"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ ...inputStyle, width: '250px' }}
          />
          <button onClick={() => handleSearch()} style={btnStyle('#3b82f6')}>جستجو</button>
          <button onClick={() => setShowScanner(true)} style={btnStyle('#8b5cf6')}>📷 اسکن با دوربین</button>
        </div>
      </div>

      {mode === 'found' && product && (
        <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>✅ {product.name}</h3>
          <p>موجودی فعلی: {product.quantity} عدد</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ ...inputStyle, width: '100px' }} />
            <button onClick={handleAddStock} style={btnStyle('#16a34a')}>افزودن به انبار</button>
          </div>
        </div>
      )}

      {mode === 'new' && (
        <div style={{ background: '#fef9c3', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>⚠️ محصول جدید</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <input placeholder="نام محصول" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={inputStyle} />
            <input placeholder="قیمت خرید" type="number" value={newProduct.buy_price} onChange={e => setNewProduct({ ...newProduct, buy_price: e.target.value })} style={inputStyle} />
            <input placeholder="قیمت فروش" type="number" value={newProduct.sell_price} onChange={e => setNewProduct({ ...newProduct, sell_price: e.target.value })} style={inputStyle} />
            <input placeholder="تعداد" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ ...inputStyle, width: '100px' }} />
          </div>
          <button onClick={handleCreateAndAdd} style={btnStyle('#d97706')}>ثبت و افزودن به انبار</button>
        </div>
      )}

      {message && <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  )
}

export default Scanner