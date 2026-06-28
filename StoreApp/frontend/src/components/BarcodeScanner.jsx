import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null)
  const isRunningRef = useRef(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('reader')
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      (text) => {
        isRunningRef.current = false
        onScan(text)
        scanner.stop().catch(() => {})
        onClose()
      },
      () => {}
    ).then(() => {
      isRunningRef.current = true
    }).catch((err) => {
      console.error('دوربین پیدا نشد:', err)
      onClose()
    })

    return () => {
        if (isRunningRef.current) {
            scanner.stop().catch(() => {})
        }
    }
  }, [])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div id="reader" style={{ width: '300px', background: 'white', borderRadius: '8px', padding: '1rem' }} />
      <p style={{ color: 'white', marginTop: '1rem' }}>دوربین را روی بارکد بگیر</p>
      <button onClick={onClose} style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
        بستن
      </button>
    </div>
  )
}

export default BarcodeScanner