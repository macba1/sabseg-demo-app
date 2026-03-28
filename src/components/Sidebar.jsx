import { colors } from '../theme'

const navItems = [
  { id: 'reconciliation', label: 'Reconciliación', icon: '⚖️', desc: 'Contable' },
  { id: 'data-quality', label: 'Data Quality', icon: '🔍', desc: 'Validación' },
]

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '240px',
      background: colors.navy,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div
        onClick={() => onNavigate('reconciliation')}
        style={{
          padding: '24px 24px 20px',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: colors.orange,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '800',
            color: colors.white,
          }}>S</div>
          <span style={{
            color: colors.white,
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '1px',
          }}>SABSEG</span>
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '11px',
          marginTop: '6px',
          letterSpacing: '0.3px',
        }}>Inteligencia Operativa</p>
      </div>

      {/* Navigation */}
      <div style={{ padding: '16px 0', flex: 1 }}>
        <p style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '10px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '0 24px',
          marginBottom: '8px',
        }}>Módulos</p>
        {navItems.map(item => {
          const isActive = activeSection === item.id
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                cursor: 'pointer',
                background: isActive ? 'rgba(232,114,26,0.12)' : 'transparent',
                borderLeft: isActive ? `3px solid ${colors.orange}` : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <div>
                <div style={{
                  color: isActive ? colors.orange : 'rgba(255,255,255,0.85)',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                }}>{item.label}</div>
                <div style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '11px',
                }}>{item.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.06)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: colors.green,
          }} />
          <span style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '11px',
          }}>Agentes activos</span>
        </div>
      </div>
    </div>
  )
}
