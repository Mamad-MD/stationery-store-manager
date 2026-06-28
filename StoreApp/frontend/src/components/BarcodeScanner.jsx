import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

function BarcodeScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const lastScannedCode = useRef('');
  const lastScannedTime = useRef(0);
  const isScanned = useRef(false);
  const [error, setError] = useState('');

  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);

      oscillator.onended = () => {
        audioCtx.close();
      };
    } catch (e) {
      console.warn('Beep failed:', e);
    }
  };

  const applyFocusMode = async () => {
    try {
      const video = videoRef.current;
      const stream = video?.srcObject;

      if (!stream) return;

      const videoTrack = stream.getVideoTracks?.()[0];
      if (!videoTrack) return;

      const capabilities = videoTrack.getCapabilities?.();
      const constraints = {};

      if (capabilities?.focusMode?.includes('continuous')) {
        constraints.advanced = [{ focusMode: 'continuous' }];
      } else if (capabilities?.focusMode?.includes('single-shot')) {
        constraints.advanced = [{ focusMode: 'single-shot' }];
      }

      if (capabilities?.torch) {
        constraints.advanced = [
          ...(constraints.advanced || []),
          { torch: false }
        ];
      }

      if (constraints.advanced?.length) {
        await videoTrack.applyConstraints(constraints);
      }
    } catch (e) {
      console.warn('Focus constraints not supported:', e);
    }
  };

  useEffect(() => {
    const hints = new Map();

    const formats = [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A,
    ];

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    codeReader.current = new BrowserMultiFormatReader(hints);

    const startScanner = async () => {
      setError('');

      try {
        const videoInputDevices = await codeReader.current.listVideoInputDevices();

        const backCamera = videoInputDevices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          (
            device.kind === 'videoinput' &&
            device.label.toLowerCase().includes('camera') &&
            !device.label.toLowerCase().includes('front')
          )
        ) || videoInputDevices[videoInputDevices.length - 1];

        if (backCamera) {
          const constraints = {
            video: {
              deviceId: { exact: backCamera.deviceId },
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 },
              focusMode: { ideal: 'continuous' },
            },
          };

          await codeReader.current.decodeFromConstraints(
            constraints,
            videoRef.current,
            (result, err) => {
              if (result) {
                const scannedCode = result.getText();
                const now = Date.now();

                if (isScanned.current) {
                  return;
                }

                if (
                  scannedCode === lastScannedCode.current &&
                  now - lastScannedTime.current < 2000
                ) {
                  return;
                }

                isScanned.current = true;
                lastScannedCode.current = scannedCode;
                lastScannedTime.current = now;

                console.log('Scanned Result (ZXing):', scannedCode);

                playBeep();
                onScan(scannedCode);

                setTimeout(() => {
                  if (codeReader.current) {
                    codeReader.current.reset();
                  }
                  onClose();
                }, 180);
              }
            }
          );

          setTimeout(() => {
            applyFocusMode();
          }, 700);
        } else {
          setError('دوربین عقبی پیدا نشد. لطفا یک دوربین دیگر را انتخاب کنید یا دسترسی را بررسی کنید.');
          onClose();
        }
      } catch (e) {
        console.error('Scanner Initialization Error (ZXing):', e);

        if (e.name === 'NotAllowedError') {
          setError('اجازه دسترسی به دوربین داده نشد. لطفا دسترسی مرورگر به دوربین را فعال کنید.');
        } else if (e.name === 'NotFoundError') {
          setError('دوربینی در دسترس نیست.');
        } else if (e.name === 'OverconstrainedError') {
          setError('تنظیمات فوکوس یا کیفیت توسط این دوربین پشتیبانی نمی‌شود.');
        } else {
          setError('خطا در دسترسی به دوربین: ' + e.message);
        }

        onClose();
      }
    };

    startScanner();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, [onScan, onClose]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '350px', background: 'white', borderRadius: '8px', padding: '1rem', boxSizing: 'border-box' }}>
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
        />

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          height: '25%',
          border: '2px dashed #4CAF50',
          borderRadius: '4px',
          pointerEvents: 'none',
          boxSizing: 'border-box'
        }}></div>

        <div style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: '50%',
          height: '2px',
          background: '#ef4444',
          boxShadow: '0 0 12px #ef4444',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}></div>
      </div>

      {error ? (
        <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
      ) : (
        <>
          <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.1rem' }}>دوربین را روی بارکد بگیر</p>
          <p style={{ color: '#d1d5db', marginTop: '0.4rem', fontSize: '0.85rem', textAlign: 'center' }}>
            برای اجناس واقعی، گوشی را ۱۵ تا ۳۰ سانتی‌متر فاصله بده و کمی زاویه بده تا نور روی بارکد بازتاب نکند
          </p>
        </>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 2rem',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        بستن
      </button>
    </div>
  );
}

export default BarcodeScanner;
