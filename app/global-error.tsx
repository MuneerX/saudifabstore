'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: '60px 20px', textAlign: 'center', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Something went wrong</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>A temporary system error occurred. Please try refreshing.</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            backgroundColor: '#0058a3',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
