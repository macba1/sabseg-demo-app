import { useState, useCallback, useRef } from 'react'
import { colors } from './theme'
import LoginScreen from './components/LoginScreen'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import RecWorkspace from './components/rec/RecWorkspace'
import RecResults from './components/rec/RecResults'
import DQWorkspace from './components/dq/DQWorkspace'
import DQResults from './components/dq/DQResults'
import AgentPanel from './components/shared/AgentPanel'
import ErrorBanner from './components/shared/ErrorBanner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function apiCall(url, options = {}) {
  const res = await fetch(url, options)
  if (!res.ok) {
    let msg = `Error ${res.status}`
    try { const body = await res.json(); msg = body.detail || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('sabseg_auth') === '1')
  const [screen, setScreen] = useState('rec-workspace')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const resultsRef = useRef(null)

  const currentSection =
    screen.startsWith('rec') ? 'reconciliation' :
    screen.startsWith('dq') ? 'data-quality' : 'reconciliation'

  const handleNavigate = (id) => {
    setError(null); setData(null); setShowResults(false)
    if (id === 'reconciliation') setScreen('rec-workspace')
    else if (id === 'data-quality') setScreen('dq-workspace')
  }

  // ─── Reconciliation ────────────────────────────────────────────────

  const handleRecDemo = async () => {
    setScreen('rec-processing'); setError(null); setData(null); setShowResults(false)
    try {
      const result = await apiCall(`${API_URL}/api/demo-sabseg-logged`, { method: 'POST' })
      setData(result)
    } catch (e) {
      setError(e.message)
      setScreen('rec-workspace')
    }
  }

  const handleRecUpload = async (files) => {
    setScreen('rec-processing'); setError(null); setData(null); setShowResults(false)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const result = await apiCall(`${API_URL}/api/reconcile-logged`, {
        method: 'POST',
        body: formData,
      })
      setData(result)
    } catch (e) {
      setError(e.message)
      setScreen('rec-workspace')
    }
  }

  // ─── Data Quality ──────────────────────────────────────────────────

  const handleDQDemo = async () => {
    setScreen('dq-processing'); setError(null); setData(null); setShowResults(false)
    try {
      const result = await apiCall(`${API_URL}/api/data-quality-demo-logged`, { method: 'POST' })
      setData(result)
    } catch (e) {
      setError(e.message)
      setScreen('dq-workspace')
    }
  }

  const handleDQUpload = async (files) => {
    setScreen('dq-processing'); setError(null); setData(null); setShowResults(false)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const result = await apiCall(`${API_URL}/api/data-quality-logged`, {
        method: 'POST',
        body: formData,
      })
      setData(result)
    } catch (e) {
      setError(e.message)
      setScreen('dq-workspace')
    }
  }

  // ─── Shared ────────────────────────────────────────────────────────

  const handleAgentAnimationDone = useCallback(() => {
    setShowResults(true)
  }, [])

  const scrollToResults = () => {
    if (resultsRef.current)
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getBreadcrumbs = () => {
    const crumbs = []
    if (screen.startsWith('rec')) {
      crumbs.push({ label: 'Reconciliación', onClick: screen !== 'rec-workspace' ? () => { setScreen('rec-workspace'); setData(null); setShowResults(false) } : undefined })
      if (screen === 'rec-processing') crumbs.push({ label: 'Procesando' })
    } else if (screen.startsWith('dq')) {
      crumbs.push({ label: 'Data Quality', onClick: screen !== 'dq-workspace' ? () => { setScreen('dq-workspace'); setData(null); setShowResults(false) } : undefined })
      if (screen === 'dq-processing') crumbs.push({ label: 'Procesando' })
    }
    return crumbs
  }

  const isRecProcessing = screen === 'rec-processing'
  const isDQProcessing = screen === 'dq-processing'
  const isProcessing = isRecProcessing || isDQProcessing

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: colors.bg,
      minHeight: '100vh',
    }}>
      <Sidebar activeSection={currentSection} onNavigate={handleNavigate} />
      <TopBar breadcrumbs={getBreadcrumbs()} />

      <main style={{
        marginLeft: '240px',
        paddingTop: '52px',
        minHeight: 'calc(100vh - 52px)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '32px',
        }}>
          {error && !isProcessing && (
            <div style={{ marginBottom: '16px' }}>
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Reconciliation */}
          {screen === 'rec-workspace' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ color: colors.navy, fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
                  Repositorio de ficheros
                </h1>
                <p style={{ color: colors.grayLight, fontSize: '14px' }}>
                  Sube los ficheros de saldos y estadísticas para la reconciliación contable
                </p>
              </div>
              <RecWorkspace onRunDemo={handleRecDemo} onRunUpload={handleRecUpload} />
            </div>
          )}

          {isRecProcessing && (
            <div>
              <AgentPanel
                entries={data ? data.agent_log : null}
                qaReport={data ? data.qa_report : null}
                loading={!data}
                variant="rec"
                onAnimationDone={handleAgentAnimationDone}
              />
              {showResults && data && (
                <div style={{ marginTop: '24px' }}>
                  <button
                    onClick={scrollToResults}
                    style={{
                      display: 'block',
                      margin: '0 auto 24px',
                      background: 'none',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      padding: '10px 24px',
                      color: colors.navy,
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.background = colors.white; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                    onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.boxShadow = 'none' }}
                  >
                    Ver resultados detallados ↓
                  </button>
                  <div ref={resultsRef} style={{ animation: 'fadeIn 0.4s ease' }}>
                    <RecResults data={data} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Data Quality */}
          {screen === 'dq-workspace' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ color: colors.navy, fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
                  Repositorio de ficheros
                </h1>
                <p style={{ color: colors.grayLight, fontSize: '14px' }}>
                  Sube los ficheros de recibos de corredurías para validación
                </p>
              </div>
              <DQWorkspace onRunDemo={handleDQDemo} onRunUpload={handleDQUpload} />
            </div>
          )}

          {isDQProcessing && (
            <div>
              <AgentPanel
                entries={data ? data.agent_log : null}
                qaReport={data ? data.qa_report : null}
                loading={!data}
                variant="dq"
                onAnimationDone={handleAgentAnimationDone}
              />
              {showResults && data && (
                <div style={{ marginTop: '24px' }}>
                  <button
                    onClick={scrollToResults}
                    style={{
                      display: 'block',
                      margin: '0 auto 24px',
                      background: 'none',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      padding: '10px 24px',
                      color: colors.navy,
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.background = colors.white; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                    onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.boxShadow = 'none' }}
                  >
                    Ver resultados detallados ↓
                  </button>
                  <div ref={resultsRef} style={{ animation: 'fadeIn 0.4s ease' }}>
                    <DQResults data={data} apiUrl={API_URL} apiCall={apiCall} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`}</style>
      </main>
    </div>
  )
}
