import { useState } from 'react'

const PASSWORD = 'sabseg2026'

export default function LoginScreen({ onLogin }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === PASSWORD) {
      sessionStorage.setItem('sabseg_auth', '1')
      onLogin()
    } else {
      setError(true)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '340px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#E8721A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800',
              color: '#FFFFFF',
            }}>S</div>
            <span style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '1.5px',
            }}>SABSEG</span>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '13px',
            marginTop: '8px',
          }}>Plataforma de Inteligencia Operativa</p>
        </div>

        {/* Password field */}
        <input
          type="password"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false) }}
          placeholder="Contraseña"
          autoFocus
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: '14px',
            borderRadius: '8px',
            border: error ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#F1F5F9',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => {
            if (!error) e.target.style.borderColor = 'rgba(232,114,26,0.5)'
          }}
          onBlur={e => {
            if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        />

        {/* Error message */}
        {error && (
          <p style={{
            color: '#EF4444',
            fontSize: '13px',
            marginTop: '8px',
            textAlign: 'left',
          }}>Contraseña incorrecta</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#FFFFFF',
            background: '#E8721A',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = '#D4650F'}
          onMouseLeave={e => e.target.style.background = '#E8721A'}
        >
          Acceder
        </button>
      </form>
    </div>
  )
}
