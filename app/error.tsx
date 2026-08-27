'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Error Boundary:', error);
  }, [error]);

  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
        Something went wrong!
      </h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        We encountered an error while loading this content.
      </p>
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
    </div>
  );
}
