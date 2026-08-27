import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Could not find requested resource.</p>
      <Link href="/" style={{ backgroundColor: '#FEEC3C', color: '#111111', fontWeight: 700, padding: '10px 24px', borderRadius: '8px', textDecoration: 'none' }}>
        Return Home
      </Link>
    </div>
  );
}
