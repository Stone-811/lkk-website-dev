'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5EFE4',
          padding: '1rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: '2rem',
              fontWeight: 900,
              color: '#2A5269',
              marginBottom: '1rem',
            }}>
              發生錯誤
            </h1>
            <p style={{
              color: '#666',
              marginBottom: '1.5rem',
            }}>
              抱歉，發生了未預期的錯誤。請重新嘗試。
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#FB720A',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              重新載入
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
