import { useState, useEffect } from 'react'
import { getProducts, createProduct, deleteProduct } from '../api/index'

function Inventory() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ barcode: '', name: '', buy_price: '', sell_price: '', quantity: 0 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const res = await getProducts()
    setProducts(res.data)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await createProduct({ ...form, buy_price: Number(form.buy_price), sell_price: Number(form.sell_price) })
      setMessage('✅ محصول اضافه شد')
      setForm({ barcode: '', name: '', buy_price: '', sell_price: '', quantity: 0 })
      loadProducts()
    } catch (e) {
      setMessage('❌ ' + (e.response?.data?.detail || 'خطا'))
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('حذف شود؟')) return
    await deleteProduct(id)
    loadProducts()
  }

  return (
    <div style={{ padding: '1rem', direction: 'rtl' }}>
      <h2>📦 انبار</h2>

      <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>افزودن محصول جدید</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input placeholder="بارکد" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="نام محصول" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="قیمت خرید" type="number" value={form.buy_price} onChange={e => setForm({ ...form, buy_price: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="قیمت فروش" type="number" value={form.sell_price} onChange={e => setForm({ ...form, sell_price: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? '...' : 'افزودن'}
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e293b', color: 'white' }}>
            <th style={{ padding: '0.5rem' }}>بارکد</th>
            <th style={{ padding: '0.5rem' }}>نام</th>
            <th style={{ padding: '0.5rem' }}>قیمت خرید</th>
            <th style={{ padding: '0.5rem' }}>قیمت فروش</th>
            <th style={{ padding: '0.5rem' }}>موجودی</th>
            <th style={{ padding: '0.5rem' }}>حذف</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
              <td style={{ padding: '0.5rem' }}>{p.barcode}</td>
              <td style={{ padding: '0.5rem' }}>{p.name}</td>
              <td style={{ padding: '0.5rem' }}>{p.buy_price.toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{p.sell_price.toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{p.quantity}</td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Inventory