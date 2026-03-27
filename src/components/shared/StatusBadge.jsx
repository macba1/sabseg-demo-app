import { colors } from '../../theme'

const statusConfig = {
  match: { bg: colors.greenBg, color: colors.green, border: colors.greenBorder, label: 'Cuadrado' },
  warning: { bg: colors.yellowBg, color: colors.yellow, border: colors.yellowBorder, label: 'Warning' },
  mismatch: { bg: colors.redBg, color: colors.red, border: colors.redBorder, label: 'Discrepancia' },
  listo: { bg: colors.greenBg, color: colors.green, border: colors.greenBorder, label: 'Listo' },
  pendiente: { bg: colors.yellowBg, color: colors.yellow, border: colors.yellowBorder, label: 'Pendiente' },
  'con errores': { bg: colors.redBg, color: colors.red, border: colors.redBorder, label: 'Con errores' },
  validado: { bg: colors.greenBg, color: colors.green, border: colors.greenBorder, label: 'Validado' },
  'pendiente validacion': { bg: colors.yellowBg, color: colors.yellow, border: colors.yellowBorder, label: 'Pendiente validación' },
}

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pendiente
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  )
}
