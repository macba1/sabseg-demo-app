import { colors, card, btnPrimary, btnDisabled, shadows } from '../../theme'
import StatusBadge from '../shared/StatusBadge'

const demoEntregas = [
  { id: 'araytor-feb', correduria: 'Araytor', periodo: 'Feb 2026', estado: 'pendiente validacion' },
  { id: 'zurriola-feb', correduria: 'Zurriola', periodo: 'Feb 2026', estado: 'pendiente validacion' },
  { id: 'seguretxe-feb', correduria: 'Seguretxe', periodo: 'Feb 2026', estado: 'pendiente validacion' },
  { id: 'arrenta-ene', correduria: 'Arrenta', periodo: 'Ene 2026', estado: 'pendiente validacion' },
  { id: 'arrenta-feb', correduria: 'Arrenta', periodo: 'Feb 2026', estado: 'pendiente validacion' },
]

export default function DQWorkspace({ onValidateAll, onBack }) {
  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: colors.gray,
          cursor: 'pointer', fontSize: '14px',
        }}>← Inicio</button>
        <span style={{ color: colors.border }}>/</span>
        <span style={{ color: colors.navy, fontWeight: '600', fontSize: '14px' }}>Data Quality</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ color: colors.navy, fontSize: '22px', fontWeight: '700' }}>
          Entregas de corredurías
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btnDisabled} disabled>+ Nueva entrega</button>
          <button
            onClick={onValidateAll}
            style={btnPrimary}
            onMouseEnter={e => e.target.style.background = '#D4650F'}
            onMouseLeave={e => e.target.style.background = colors.orange}
          >
            Validar todo
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {demoEntregas.map(e => (
          <div
            key={e.id}
            style={{
              ...card,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={ev => ev.currentTarget.style.boxShadow = shadows.lg}
            onMouseLeave={ev => ev.currentTarget.style.boxShadow = shadows.md}
          >
            <div>
              <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {e.correduria} - {e.periodo}
              </h3>
              <span style={{ color: colors.gray, fontSize: '13px' }}>
                Correduría: {e.correduria} · Periodo: {e.periodo}
              </span>
            </div>
            <StatusBadge status={e.estado} />
          </div>
        ))}
      </div>
    </div>
  )
}
