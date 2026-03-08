import { useState } from 'react'
import Upload from './components/Upload'
import Processing from './components/Processing'
import Dashboard from './components/Dashboard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [screen, setScreen] = useState('upload') // upload | processing | dashboard
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = async (fileA, fileB) => {
    setScreen('processing')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file_a', fileA)
      formData.append('file_b', fileB)

      const res = await fetch(`${API_URL}/api/reconcile`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error procesando ficheros')
      }

      const result = await res.json()
      setData(result)
      setScreen('dashboard')
    } catch (e) {
      setError(e.message)
      setScreen('upload')
    }
  }

  const handleDemo = async () => {
    setScreen('processing')
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/demo`, { method: 'POST' })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error cargando demo')
      }

      const result = await res.json()
      setData(result)
      setScreen('dashboard')
    } catch (e) {
      setError(e.message)
      setScreen('upload')
    }
  }

  const handleReset = () => {
    setScreen('upload')
    setData(null)
    setError(null)
  }

  return (
    <>
      {screen === 'upload' && (
        <Upload onUpload={handleUpload} onDemo={handleDemo} error={error} />
      )}
      {screen === 'processing' && <Processing />}
      {screen === 'dashboard' && data && (
        <Dashboard data={data} onReset={handleReset} />
      )}
    </>
  )
}
