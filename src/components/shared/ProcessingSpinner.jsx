import { colors } from '../../theme'

export default function ProcessingSpinner({ message = 'Procesando...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '24px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: `4px solid ${colors.border}`,
        borderTopColor: colors.orange,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: colors.gray, fontSize: '16px', fontWeight: '500' }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
