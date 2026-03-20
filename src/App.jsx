import { useState } from 'react'
import Landing from './components/Landing'
import Upload from './components/Upload'
import Processing from './components/Processing'
import Dashboard from './components/Dashboard'
import NormalizeUpload from './components/NormalizeUpload'
import NormalizeProcessing from './components/NormalizeProcessing'
import NormalizeDashboard from './components/NormalizeDashboard'

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
  const [screen, setScreen] = useState('landing')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [normMode, setNormMode] = useState(null) // 'demo' | 'upload'
  const [normFiles, setNormFiles] = useState(null) // stored File objects for on-demand consolidation

  const goLanding = () => { setScreen('landing'); setData(null); setError(null); setNormMode(null); setNormFiles(null) }

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
      setData(await apiCall(endpoint, { method: 'POST', body: formData }))
      setScreen('rec-dashboard')
    } catch (e) { setError(e.message); setScreen('rec-upload') }
  }

  const handleDemo = async () => {
    setScreen('rec-processing'); setError(null)
    try {
      setData(await apiCall(`${API_URL}/api/demo`, { method: 'POST' }))
      setScreen('rec-dashboard')
    } catch (e) { setError(e.message); setScreen('rec-upload') }
  }

  const handleDemoTriangular = async () => {
    setScreen('rec-processing'); setError(null)
    try {
      setData(await apiCall(`${API_URL}/api/demo?triangular=true`, { method: 'POST' }))
      setScreen('rec-dashboard')
    } catch (e) { setError(e.message); setScreen('rec-upload') }
  }

  // ─── Normalization flow ────────────────────────────────────────────

  const handleNormAnalyze = async (files) => {
    setScreen('norm-processing'); setError(null)
    setNormMode('upload'); setNormFiles(files)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      setData(await apiCall(`${API_URL}/api/normalize-batch`, { method: 'POST', body: formData }))
      setScreen('norm-dashboard')
    } catch (e) { setError(e.message); setScreen('norm-upload') }
  }

  const handleNormDemo = async () => {
    setScreen('norm-processing'); setError(null)
    setNormMode('demo'); setNormFiles(null)
    try {
      setData(await apiCall(`${API_URL}/api/normalize-demo`, { method: 'POST' }))
      setScreen('norm-dashboard')
    } catch (e) { setError(e.message); setScreen('norm-upload') }
  }

  const handleConsolidate = async () => {
    if (normMode === 'demo') {
      return apiCall(`${API_URL}/api/normalize-demo-consolidate`, { method: 'POST' })
    } else {
      const formData = new FormData()
      normFiles.forEach(f => formData.append('files', f))
      return apiCall(`${API_URL}/api/normalize-consolidate`, { method: 'POST', body: formData })
    }
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
        <NormalizeDashboard data={data} onBack={goLanding} onConsolidate={handleConsolidate} />
      )}
    </>
  )
}
