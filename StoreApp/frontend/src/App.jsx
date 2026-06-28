import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Inventory from './pages/Inventory'
import Scanner from './pages/Scanner'
import Sales from './pages/Sales'
import Reports from './pages/Reports'

function NavLink({ to, children }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link to={to} style={{
      color: active ? '#facc15' : 'white',
      textDecoration: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      fontWeight: active ? '700' : '400',
      fontSize: '1rem',
      whiteSpace: 'nowrap'
    }}>
      {children}
    </Link>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        padding: '0.75rem 1rem',
        background: '#1e293b',
        display: 'flex',
        gap: '0.25rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <NavLink to="/">📦 انبار</NavLink>
        <NavLink to="/scanner">📷 دریافت کالا</NavLink>
        <NavLink to="/sales">🛒 فروش</NavLink>
        <NavLink to="/reports">📊 گزارش</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
