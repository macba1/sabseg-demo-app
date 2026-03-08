import { useState, useEffect } from 'react'

const steps = [
  'Leyendo ficheros...',
  'Detectando columnas y estructura...',
  'Cruzando registros por referencia...',
  'Buscando duplicados...',
  'Comparando primas y comisiones...',
  'Analizando diferencias de timing...',
  'Clasificando discrepancias...',
  'Generando informe...',
]

export default function Processing() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const pct = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div style={{
      minHeight: '100vh', background: '#080d1a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '32px 20px',
    }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        {/* Spinner */}
        <div style={{ marginBottom: '32px' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ animation: 'spin 1.5s linear infinite' }}>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="4" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e94560" strokeWidth="4"
              strokeDasharray="176" strokeDashoffset="132" strokeLinecap="round" />
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
          Analizando cierre contable
        </div>

        <div style={{ fontSize: '14px', color: '#e94560', marginBottom: '24px', minHeight: '20px' }}>
          {steps[step]}
        </div>

        {/* Progress bar */}
        <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #e94560, #f87171)',
            borderRadius: '3px', transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ fontSize: '12px', color: '#475569' }}>{pct}%</div>
      </div>
    </div>
  )
}
