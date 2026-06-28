import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Inventory from './pages/Inventory'
import Scanner from './pages/Scanner'
import Sales from './pages/Sales'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
     <nav style={{ padding: '1rem', background: '#1e293b', display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>انبار</Link>
        <Link to="/scanner" style={{ color: 'white', textDecoration: 'none' }}>دریافت کالا</Link>
        <Link to="/sales" style={{ color: 'white', textDecoration: 'none' }}>فروش</Link>
        <Link to="/reports" style={{ color: 'white', textDecoration: 'none' }}>گزارش</Link>
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