import { colors } from '../theme'

export default function TopBar({ breadcrumbs = [] }) {
  return (
    <div style={{
      height: '52px',
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      marginLeft: '240px',
    }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && <span style={{ color: colors.border, fontSize: '12px' }}>/</span>}
            {crumb.onClick ? (
              <button
                onClick={crumb.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.grayLight,
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onMouseEnter={e => e.target.style.color = colors.navy}
                onMouseLeave={e => e.target.style.color = colors.grayLight}
              >{crumb.label}</button>
            ) : (
              <span style={{
                color: colors.navy,
                fontSize: '13px',
                fontWeight: '600',
              }}>{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: colors.green,
        }} />
        <span style={{
          color: colors.gray,
          fontSize: '12px',
          fontWeight: '500',
        }}>Sistema de Agentes v1.0</span>
      </div>
    </div>
  )
}
