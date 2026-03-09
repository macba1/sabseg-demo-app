import { useState, useEffect } from 'react'
import Logo from './Logo'

const steps = [
  'Leyendo ficheros...',
  'Detectando idioma y país de origen...',
  'Analizando esquema de columnas...',
  'Mapeando campos al modelo canónico...',
  'Normalizando valores...',
  'Validando calidad de datos...',
  'Detectando duplicados y anomalías...',
  'Generando informe...',
]

export default function NormalizeProcessing() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s))
    }, 700)
    return () => clearInterval(interval)
  }, [])

  const pct = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div style={{
      minHeight: '100vh', background: '#FFFFFF', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '32px 20px',
    }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <Logo />
        <div style={{ marginBottom: '32px' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ animation: 'spin 1.5s linear infinite' }}>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#E2E8F0" strokeWidth="4" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="#E8721A" strokeWidth="4"
              strokeDasharray="176" strokeDashoffset="132" strokeLinecap="round" />
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <div style={{ fontSize: '20px', fontWeight: 600, color: '#1B2A4A', marginBottom: '8px' }}>
          Homogeneizando datos
        </div>
        <div style={{ fontSize: '14px', color: '#E8721A', marginBottom: '24px', minHeight: '20px' }}>
          {steps[step]}
        </div>
        <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #E8721A, #F59E0B)',
            borderRadius: '3px', transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>{pct}%</div>
      </div>
    </div>
  )
}
