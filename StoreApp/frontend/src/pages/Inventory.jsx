import { useState, useEffect } from 'react'
import { getProducts, createProduct, deleteProduct } from '../api/index'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://192.168.0.100:8000' })

function Inventory() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ barcode: '', name: '', buy_price: '', sell_price: '', quantity: 0 })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    const res = await getProducts()
    setProducts(res.data)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        buy_price: Number(form.buy_price),
        sell_price: Number(form.sell_price),
        quantity: Number(form.quantity)
      }
      if (editId) {
        await api.put(`/products/${editId}`, payload)
        setMessage('✅ محصول ویرایش شد')
        setEditId(null)
      } else {
        await createProduct(payload)
        setMessage('✅ محصول اضافه شد')
      }
      setForm({ barcode: '', name: '', buy_price: '', sell_price: '', quantity: 0 })
      loadProducts()
    } catch (e) {
      setMessage('❌ ' + (e.response?.data?.detail || 'خطا'))
    }
    setLoading(false)
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ barcode: p.barcode, name: p.name, buy_price: p.buy_price, sell_price: p.sell_price, quantity: p.quantity })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditId(null)
    setForm({ barcode: '', name: '', buy_price: '', sell_price: '', quantity: 0 })
    setMessage('')
  }

  const handleDelete = async (id) => {
    if (!confirm('حذف شود؟')) return
    await deleteProduct(id)
    loadProducts()
  }

  const filtered = products.filter(p =>
    p.name.includes(search) || p.barcode.includes(search)
  )

  const inp = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }

  return (
    <div style={{ padding: '1rem', direction: 'rtl' }}>
      <h2>📦 انبار</h2>

      <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>{editId ? '✏️ ویرایش محصول' : 'افزودن محصول جدید'}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input placeholder="بارکد" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} style={inp} />
          <input placeholder="نام محصول" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
          <input placeholder="قیمت خرید" type="number" value={form.buy_price} onChange={e => setForm({ ...form, buy_price: e.target.value })} style={inp} />
          <input placeholder="قیمت فروش" type="number" value={form.sell_price} onChange={e => setForm({ ...form, sell_price: e.target.value })} style={inp} />
          <input placeholder="موجودی" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={{ ...inp, width: '80px' }} />
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '0.5rem 1rem', background: editId ? '#d97706' : '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? '...' : editId ? 'ذخیره' : 'افزودن'}
          </button>
          {editId && (
            <button onClick={handleCancel} style={{ padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              انصراف
            </button>
          )}
        </div>
        {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="🔍 جستجو بر اساس نام یا بارکد..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp, width: '100%', boxSizing: 'border-box', fontSize: '1rem' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e293b', color: 'white' }}>
            <th style={{ padding: '0.5rem' }}>بارکد</th>
            <th style={{ padding: '0.5rem' }}>نام</th>
            <th style={{ padding: '0.5rem' }}>قیمت خرید</th>
            <th style={{ padding: '0.5rem' }}>قیمت فروش</th>
            <th style={{ padding: '0.5rem' }}>موجودی</th>
            <th style={{ padding: '0.5rem' }}>ویرایش</th>
            <th style={{ padding: '0.5rem' }}>حذف</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center', background: p.quantity === 0 ? '#fff1f2' : 'white' }}>
              <td style={{ padding: '0.5rem' }}>{p.barcode}</td>
              <td style={{ padding: '0.5rem' }}>{p.name}</td>
              <td style={{ padding: '0.5rem' }}>{p.buy_price.toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{p.sell_price.toLocaleString()}</td>
              <td style={{ padding: '0.5rem', color: p.quantity === 0 ? '#ef4444' : 'inherit', fontWeight: p.quantity === 0 ? 'bold' : 'normal' }}>
                {p.quantity === 0 ? '⚠️ ناموجود' : p.quantity}
              </td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleEdit(p)} style={{ background: '#d97706', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>✏️</button>
              </td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>حذف</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>محصولی یافت نشد</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Inventory
