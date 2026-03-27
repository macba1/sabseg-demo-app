import { colors, shadows } from '../theme'

export default function Header({ currentSection, onNavigate }) {
  const navItems = [
    { id: 'reconciliation', label: 'Reconciliación' },
    { id: 'data-quality', label: 'Data Quality' },
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: shadows.sm,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 100,
    }}>
      <div
        onClick={() => onNavigate('landing')}
        style={{
          fontSize: '20px',
          fontWeight: '800',
          color: colors.navy,
          letterSpacing: '1px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        SABSEG
      </div>
      <nav style={{ display: 'flex', gap: '4px' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: currentSection === item.id ? colors.bg : 'transparent',
              color: currentSection === item.id ? colors.navy : colors.gray,
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: currentSection === item.id ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
