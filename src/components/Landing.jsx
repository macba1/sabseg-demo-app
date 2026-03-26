const ORANGE = '#E8721A'

const cards = [
  {
    id: 'reconciliation',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="2" y="8" width="14" height="20" rx="2" stroke="#1B2A4A" strokeWidth="2" />
        <rect x="20" y="8" width="14" height="20" rx="2" stroke="#1B2A4A" strokeWidth="2" />
        <path d="M16 18h4" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
        <path d="M7 15h4M7 19h4M7 23h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M25 15h4M25 19h4M25 23h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 12L11 14L15 10" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Reconciliación Contable',
    sub: 'Cuadre automático entre estadística de venta y contabilidad',
  },
  {
    id: 'normalization',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="6" width="10" height="8" rx="2" stroke="#DC2626" strokeWidth="1.5" />
        <rect x="4" y="16" width="10" height="8" rx="2" stroke="#F59E0B" strokeWidth="1.5" />
        <rect x="4" y="26" width="10" height="8" rx="2" stroke="#2563eb" strokeWidth="1.5" />
        <rect x="22" y="12" width="12" height="16" rx="2" stroke="#1B2A4A" strokeWidth="2" />
        <path d="M14 10h4l4 8M14 20h4l4 0M14 30h4l4-8" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 18h4M26 22h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Homogeneización de Datos',
    sub: 'Normalización automática de datos de corredurías adquiridas',
  },
  {
    id: 'data-quality',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="4" width="24" height="28" rx="3" stroke="#1B2A4A" strokeWidth="2" />
        <path d="M12 14h12M12 19h8M12 24h10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="27" cy="27" r="7" fill="#FFFFFF" stroke={ORANGE} strokeWidth="2" />
        <path d="M25 27l1.5 1.5L29 25" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 9h4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Data Quality',
    sub: 'Validación automática de ficheros de recibos',
  },
]

export default function Landing({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }}>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '10px', color: '#1B2A4A', lineHeight: 1 }}>SABSEG</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', letterSpacing: '1.5px' }}>Powered by Richmond Partners</div>
        </div>

        <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', fontWeight: 400 }}>
          Plataforma de Inteligencia Operativa
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cards.map(c => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '20px', padding: '24px 28px',
                background: '#F8F9FA', borderRadius: '14px', border: '1px solid #E2E8F0',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.boxShadow = '0 2px 12px rgba(232,114,26,0.10)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#1B2A4A', marginBottom: '4px' }}>{c.title}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{c.sub}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '20px', flexShrink: 0 }}>›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
