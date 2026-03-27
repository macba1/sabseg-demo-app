import { colors, card, btnPrimary, shadows } from '../theme'

const products = [
  {
    id: 'reconciliation',
    icon: '⚖️',
    title: 'Reconciliación Contable',
    subtitle: 'Cruza estadísticas de venta con contabilidad para detectar discrepancias automáticamente.',
  },
  {
    id: 'data-quality',
    icon: '🔍',
    title: 'Data Quality',
    subtitle: 'Valida ficheros de recibos, detecta errores y genera informes para corredurías.',
  },
]

export default function Landing({ onSelect }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 56px)',
      padding: '40px 24px',
    }}>
      <h1 style={{
        color: colors.navy,
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '8px',
      }}>
        Bienvenido a Sabseg
      </h1>
      <p style={{
        color: colors.gray,
        fontSize: '16px',
        marginBottom: '40px',
      }}>
        Plataforma de inteligencia para corredurías de seguros
      </p>
      <div style={{
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {products.map(p => (
          <div key={p.id} style={{
            ...card,
            width: '340px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'pointer',
          }}
            onClick={() => onSelect(p.id)}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = shadows.lg; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = shadows.md; e.currentTarget.style.transform = 'none' }}
          >
            <span style={{ fontSize: '40px', marginBottom: '16px' }}>{p.icon}</span>
            <h2 style={{ color: colors.navy, fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              {p.title}
            </h2>
            <p style={{ color: colors.gray, fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
              {p.subtitle}
            </p>
            <button style={btnPrimary}
              onMouseEnter={e => e.target.style.background = '#D4650F'}
              onMouseLeave={e => e.target.style.background = colors.orange}
            >
              Acceder
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
