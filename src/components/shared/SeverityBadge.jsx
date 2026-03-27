import { colors } from '../../theme'

const config = {
  error: { bg: colors.redBg, color: colors.red, border: colors.redBorder, icon: '●' },
  warning: { bg: colors.yellowBg, color: colors.yellow, border: colors.yellowBorder, icon: '●' },
  'auto-fix': { bg: colors.greenBg, color: colors.green, border: colors.greenBorder, icon: '●' },
  info: { bg: colors.blueBg, color: '#3B82F6', border: colors.blueBorder, icon: '●' },
}

export default function SeverityBadge({ severity }) {
  const cfg = config[severity] || config.info
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ fontSize: '8px' }}>{cfg.icon}</span>
      {severity === 'auto-fix' ? 'Auto-fix' : severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  )
}
