export const colors = {
  navy: '#1B2A4A',
  orange: '#E8721A',
  orangeHover: '#D4650F',
  gray: '#64748B',
  grayLight: '#94A3B8',
  bg: '#F8FAFB',
  white: '#FFFFFF',
  border: '#E2E8F0',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBorder: '#FECACA',
  yellow: '#D97706',
  yellowBg: '#FFFBEB',
  yellowBorder: '#FDE68A',
  green: '#16A34A',
  greenBg: '#F0FDF4',
  greenBorder: '#BBF7D0',
  blueBg: '#EFF6FF',
  blueBorder: '#BFDBFE',
}

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
}

export const card = {
  background: colors.white,
  borderRadius: '12px',
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`,
}

export const btnPrimary = {
  background: colors.orange,
  color: colors.white,
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.2s',
}

export const btnSecondary = {
  background: colors.white,
  color: colors.navy,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
}

export const btnDisabled = {
  ...btnSecondary,
  opacity: 0.5,
  cursor: 'not-allowed',
}
