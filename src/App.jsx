import { useState } from 'react'
import { colors } from './theme'
import Header from './components/Header'
import Landing from './components/Landing'
import RecWorkspace from './components/rec/RecWorkspace'
import RecClosingDetail from './components/rec/RecClosingDetail'
import RecResults from './components/rec/RecResults'
import DQWorkspace from './components/dq/DQWorkspace'
import DQResults from './components/dq/DQResults'
import ProcessingSpinner from './components/shared/ProcessingSpinner'
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

/*
  Screen states:
  - landing
  - rec-workspace → rec-closing → rec-processing → rec-results
  - dq-workspace → dq-processing → dq-results
*/

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCierre, setSelectedCierre] = useState(null)

  const currentSection =
    screen.startsWith('rec') ? 'reconciliation' :
    screen.startsWith('dq') ? 'data-quality' : null

  const goLanding = () => { setScreen('landing'); setData(null); setError(null); setSelectedCierre(null) }

  const handleNavigate = (id) => {
    setError(null); setData(null); setSelectedCierre(null)
    if (id === 'landing') setScreen('landing')
    else if (id === 'reconciliation') setScreen('rec-workspace')
    else if (id === 'data-quality') setScreen('dq-workspace')
  }

  // ─── Reconciliation flow ───────────────────────────────────────────

  const handleSelectCierre = (cierre) => {
    setSelectedCierre(cierre)
    setScreen('rec-closing')
  }

  const handleRunReconciliation = async () => {
    setScreen('rec-processing'); setError(null)
    try {
      setData(await apiCall(`${API_URL}/api/demo-sabseg`, { method: 'POST' }))
      setScreen('rec-results')
    } catch (e) {
      setError(e.message)
      setScreen('rec-closing')
    }
  }

  // ─── Data Quality flow ─────────────────────────────────────────────

  const handleDQValidateAll = async () => {
    setScreen('dq-processing'); setError(null)
    try {
      setData(await apiCall(`${API_URL}/api/data-quality-demo`, { method: 'POST' }))
      setScreen('dq-results')
    } catch (e) {
      setError(e.message)
      setScreen('dq-workspace')
    }
  }

  // ─── Routing ───────────────────────────────────────────────────────

  const isProcessing = screen === 'rec-processing' || screen === 'dq-processing'

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: colors.bg, minHeight: '100vh' }}>
      <Header currentSection={currentSection} onNavigate={handleNavigate} />
      <main style={{ paddingTop: '56px', transition: 'opacity 0.2s', opacity: isProcessing ? 0.6 : 1 }}>
        {error && !isProcessing && (
          <div style={{ maxWidth: '1000px', margin: '16px auto 0', padding: '0 32px' }}>
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {screen === 'landing' && (
          <Landing onSelect={handleNavigate} />
        )}

        {/* Reconciliation */}
        {screen === 'rec-workspace' && (
          <RecWorkspace onSelectCierre={handleSelectCierre} onBack={goLanding} />
        )}
        {screen === 'rec-closing' && selectedCierre && (
          <RecClosingDetail cierre={selectedCierre} onBack={() => setScreen('rec-workspace')} onRun={handleRunReconciliation} />
        )}
        {screen === 'rec-processing' && <ProcessingSpinner message="Ejecutando reconciliación..." />}
        {screen === 'rec-results' && data && (
          <RecResults data={data} onBack={() => setScreen('rec-workspace')} />
        )}

        {/* Data Quality */}
        {screen === 'dq-workspace' && (
          <DQWorkspace onValidateAll={handleDQValidateAll} onBack={goLanding} />
        )}
        {screen === 'dq-processing' && <ProcessingSpinner message="Validando ficheros..." />}
        {screen === 'dq-results' && data && (
          <DQResults data={data} onBack={() => setScreen('dq-workspace')} apiUrl={API_URL} apiCall={apiCall} />
        )}
      </main>
    </div>
  )
}
