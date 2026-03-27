import { colors, card, btnPrimary, btnDisabled, shadows } from '../../theme'
import StatusBadge from '../shared/StatusBadge'

const demoCierres = [
  {
    id: 'cierre-feb-2026',
    label: 'Cierre Febrero 2026',
    periodo: 'Febrero 2026',
    estado: 'listo',
    ficheros: 15,
  },
  {
    id: 'cierre-ene-2026',
    label: 'Cierre Enero 2026',
    periodo: 'Enero 2026',
    estado: 'listo',
    ficheros: 15,
  },
]

export default function RecWorkspace({ onSelectCierre, onBack }) {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: colors.gray,
          cursor: 'pointer', fontSize: '14px',
        }}>← Inicio</button>
        <span style={{ color: colors.border }}>/</span>
        <span style={{ color: colors.navy, fontWeight: '600', fontSize: '14px' }}>Reconciliación Contable</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ color: colors.navy, fontSize: '22px', fontWeight: '700' }}>
          Cierres mensuales
        </h1>
        <button style={btnDisabled} disabled>
          + Nuevo cierre
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {demoCierres.map(c => (
          <div
            key={c.id}
            onClick={() => onSelectCierre(c)}
            style={{
              ...card,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = shadows.lg}
            onMouseLeave={e => e.currentTarget.style.boxShadow = shadows.md}
          >
            <div>
              <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {c.label}
              </h3>
              <span style={{ color: colors.gray, fontSize: '13px' }}>
                Periodo: {c.periodo} · {c.ficheros} ficheros cargados
              </span>
            </div>
            <StatusBadge status={c.estado} />
          </div>
        ))}
      </div>
    </div>
  )
}
