import { useState } from 'react'
import Landing from './components/Landing'
import Upload from './components/Upload'
import Processing from './components/Processing'
import Dashboard from './components/Dashboard'
import NormalizeUpload from './components/NormalizeUpload'
import NormalizeProcessing from './components/NormalizeProcessing'
import NormalizeDashboard from './components/NormalizeDashboard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const goLanding = () => { setScreen('landing'); setData(null); setError(null) }

  // ─── Reconciliation flow ───────────────────────────────────────────

  const handleUpload = async (fileA, fileB, fileC) => {
    setScreen('rec-processing')
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file_a', fileA)
      formData.append('file_b', fileB)
      let endpoint = `${API_URL}/api/reconcile`
      if (fileC) {
        formData.append('file_c', fileC)
        endpoint = `${API_URL}/api/reconcile-triangular`
      }
      const res = await fetch(endpoint, { method: 'POST', body: formData })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Error procesando ficheros') }
      setData(await res.json())
      setScreen('rec-dashboard')
    } catch (e) { setError(e.message); setScreen('rec-upload') }
  }

  const handleDemo = async () => {
    setScreen('rec-processing'); setError(null)
    try {
      const res = await fetch(`${API_URL}/api/demo`, { method: 'POST' })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Error cargando demo') }
      setData(await res.json()); setScreen('rec-dashboard')
    } catch (e) { setError(e.message); setScreen('rec-upload') }
  }

  const handleDemoTriangular = async () => {
    setScreen('rec-processing'); setError(null)
    try {
      const res = await fetch(`${API_URL}/api/demo?triangular=true`, { method: 'POST' })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Error cargando demo triangular') }
      setData(await res.json()); setScreen('rec-dashboard')
    } catch (e) { setError(e.message); setScreen('rec-upload') }
  }

  // ─── Normalization flow ────────────────────────────────────────────

  const handleNormAnalyze = async (files) => {
    setScreen('norm-processing'); setError(null)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const res = await fetch(`${API_URL}/api/normalize-batch`, { method: 'POST', body: formData })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Error procesando ficheros') }
      setData(await res.json()); setScreen('norm-dashboard')
    } catch (e) { setError(e.message); setScreen('norm-upload') }
  }

  const handleNormDemo = async () => {
    setScreen('norm-processing'); setError(null)
    try {
      const res = await fetch(`${API_URL}/api/normalize-demo`, { method: 'POST' })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Error cargando demo') }
      setData(await res.json()); setScreen('norm-dashboard')
    } catch (e) { setError(e.message); setScreen('norm-upload') }
  }

  // ─── Routing ───────────────────────────────────────────────────────

  return (
    <>
      {screen === 'landing' && (
        <Landing onSelect={id => {
          setError(null); setData(null)
          setScreen(id === 'reconciliation' ? 'rec-upload' : 'norm-upload')
        }} />
      )}

      {/* Reconciliation */}
      {screen === 'rec-upload' && (
        <Upload onUpload={handleUpload} onDemo={handleDemo} onDemoTriangular={handleDemoTriangular} onBack={goLanding} error={error} />
      )}
      {screen === 'rec-processing' && <Processing />}
      {screen === 'rec-dashboard' && data && (
        <Dashboard data={data} onReset={goLanding} />
      )}

      {/* Normalization */}
      {screen === 'norm-upload' && (
        <NormalizeUpload onAnalyze={handleNormAnalyze} onDemo={handleNormDemo} onBack={goLanding} error={error} />
      )}
      {screen === 'norm-processing' && <NormalizeProcessing />}
      {screen === 'norm-dashboard' && data && (
        <NormalizeDashboard data={data} onBack={goLanding} />
      )}
    </>
  )
}
