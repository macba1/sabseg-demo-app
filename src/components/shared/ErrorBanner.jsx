import { colors } from '../../theme'

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div style={{
      background: colors.redBg,
      border: `1px solid ${colors.redBorder}`,
      borderRadius: '8px',
      padding: '12px 16px',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      color: colors.red,
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: 'none', border: 'none', color: colors.red,
          cursor: 'pointer', fontSize: '18px', padding: '0 0 0 12px',
        }}>×</button>
      )}
    </div>
  )
}
