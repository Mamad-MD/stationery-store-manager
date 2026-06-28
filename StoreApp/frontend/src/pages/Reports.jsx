import { useState, useEffect } from 'react'
import { getSummary, getLogs } from '../api/index'

function Reports() {
  const [summary, setSummary] = useState(null)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    getSummary().then(r => setSummary(r.data))
    getLogs().then(r => setLogs(r.data))
  }, [])

  const typeLabel = (t) => t === 'sell' ? '🛒 فروش' : t === 'buy' ? '📦 خرید' : '➖ کاهش'
  const typeColor = (t) => t === 'sell' ? '#16a34a' : t === 'buy' ? '#3b82f6' : '#ef4444'

  return (
    <div style={{ padding: '1rem', direction: 'rtl' }}>
      <h2>📊 گزارش مالی</h2>

      {summary && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { label: 'تعداد محصولات', value: summary.total_products, color: '#3b82f6' },
            { label: 'ارزش انبار (خرید)', value: summary.inventory_buy_value.toLocaleString() + ' ت', color: '#8b5cf6' },
            { label: 'ارزش انبار (فروش)', value: summary.inventory_sell_value.toLocaleString() + ' ت', color: '#f59e0b' },
            { label: 'کل فروش', value: summary.total_sales.toLocaleString() + ' ت', color: '#16a34a' },
          ].map(card => (
            <div key={card.label} style={{ background: card.color, color: 'white', padding: '1rem 2rem', borderRadius: '8px', minWidth: '180px' }}>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{card.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      <h3>لاگ تراکنش‌ها</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e293b', color: 'white' }}>
            <th style={{ padding: '0.5rem' }}>نوع</th>
            <th style={{ padding: '0.5rem' }}>محصول</th>
            <th style={{ padding: '0.5rem' }}>تعداد</th>
            <th style={{ padding: '0.5rem' }}>مبلغ</th>
            <th style={{ padding: '0.5rem' }}>زمان</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
              <td style={{ padding: '0.5rem', color: typeColor(log.type), fontWeight: 'bold' }}>{typeLabel(log.type)}</td>
              <td style={{ padding: '0.5rem' }}>{log.product_name}</td>
              <td style={{ padding: '0.5rem' }}>{log.quantity}</td>
              <td style={{ padding: '0.5rem' }}>{log.price.toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{new Date(log.timestamp).toLocaleString('fa-IR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Reports