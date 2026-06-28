import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

function BarcodeScanner({ onScan, onClose }) {
  const videoRef = useRef(null); // رفرنس به عنصر ویدئو برای نمایش تصویر دوربین
  const codeReader = useRef(null); // رفرنس به اینستنس ZXing برای مدیریت اسکنر
  const [error, setError] = useState(''); // برای نمایش خطاهای دسترسی به دوربین

  useEffect(() => {
    // 1. تنظیمات پیشرفته برای ZXing:
    // - فرمت‌های بارکد: پشتیبانی از QR Code، EAN-13 (رایج در ایران), Code-128 (صنعتی), Code-39
    // - TRY_HARDER: تلاش بیشتر برای خواندن بارکدهای دشوار (مثل بارکدهای کوچک یا تار)
    const hints = new Map();
    const formats = [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8, // اضافه شد
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A // اضافه شد
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);
    // hints.set(DecodeHintType.PURE_BARCODE, true); // اگر فقط بارکد خالص انتظار دارید

    codeReader.current = new BrowserMultiFormatReader(hints);

    const startScanner = async () => {
      setError(''); // پاک کردن خطاهای قبلی
      try {
        const videoInputDevices = await codeReader.current.listVideoInputDevices();
        
        // 2. انتخاب هوشمندانه دوربین عقب (معمولاً بهترین گزینه برای اسکن)
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.kind === 'videoinput' && device.label.toLowerCase().includes('camera') && !device.label.toLowerCase().includes('front')
        ) || videoInputDevices[videoInputDevices.length - 1]; // اگر پیدا نشد، آخرین دوربین را انتخاب کن

        if (backCamera) {
          await codeReader.current.decodeFromVideoDevice(
            backCamera.deviceId, // شناسه دوربین انتخاب شده
            videoRef.current,    // عنصری که ویدئو در آن نمایش داده می‌شود
            (result, err) => {
              if (result) {
                // اگر بارکد با موفقیت خوانده شد
                console.log("Scanned Result (ZXing):", result.getText());
                onScan(result.getText()); // فراخوانی تابع onScan کاربر
                codeReader.current.reset(); // متوقف کردن اسکنر بلافاصله پس از اولین اسکن
                onClose(); // بستن کامپوننت اسکنر
              }
              // اگر خطایی رخ دهد (مثلاً بارکد خوانده نشد), نیازی به نمایش آن در اینجا نیست مگر اینکه یک خطای جدی باشد
            }
          );
        } else {
            setError('دوربین عقبی پیدا نشد. لطفا یک دوربین دیگر را انتخاب کنید یا دسترسی را بررسی کنید.');
            onClose(); // بستن اگر دوربین مناسب پیدا نشد
        }
      } catch (e) {
        console.error("Scanner Initialization Error (ZXing):", e);
        if (e.name === 'NotAllowedError') {
            setError('اجازه دسترسی به دوربین داده نشد. لطفا دسترسی مرورگر به دوربین را فعال کنید.');
        } else if (e.name === 'NotFoundError') {
            setError('دوربینی در دسترس نیست.');
        } else {
            setError('خطا در دسترسی به دوربین: ' + e.message);
        }
        onClose(); // بستن در صورت خطا
      }
    };

    startScanner();

    // 3. Cleanup: توقف اسکنر و بستن دوربین هنگام خروج از کامپوننت
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, [onScan, onClose]); // وابستگی‌ها: اطمینان از اینکه useEffect هنگام تغییر این توابع دوباره اجرا نمی‌شود

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Container برای ویدئو و قاب اسکن */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '350px', background: 'white', borderRadius: '8px', padding: '1rem', boxSizing: 'border-box' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
        />
        {/* قاب راهنمای اسکن (مستطیل افقی برای بارکدهای خطی) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%', // کمی عریض‌تر برای بارکدهای خطی
          height: '25%', // ارتفاع کمتر
          border: '2px dashed #4CAF50', // رنگ سبز
          borderRadius: '4px',
          pointerEvents: 'none', // اجازه می‌دهد کاربر عناصر پشت این div را کلیک کند
          boxSizing: 'border-box'
        }}></div>
      </div>
      
      {/* پیام‌ها و دکمه بستن */}
      {error ? (
        <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
      ) : (
        <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.1rem' }}>دوربین را روی بارکد بگیر</p>
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
