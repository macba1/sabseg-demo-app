import { useState, useRef } from 'react'
import Logo from './Logo'

const ORANGE = '#E8721A'

const s = {
  page: { minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' },
  card: { maxWidth: '560px', width: '100%' },
  tag: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: ORANGE, fontWeight: 700, marginBottom: '12px' },
  title: { fontSize: '32px', fontWeight: 300, color: '#1B2A4A', marginBottom: '8px', lineHeight: 1.2 },
  bold: { fontWeight: 700 },
  sub: { fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '32px' },
  dropzone: (active, hasFile) => ({
    border: `2px dashed ${active ? ORANGE : hasFile ? '#86efac' : '#E2E8F0'}`,
    borderRadius: '14px',
    padding: '28px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: active ? '#E8721A08' : hasFile ? '#f0fdf4' : '#F8F9FA',
    transition: 'all 0.2s ease',
    marginBottom: '12px',
  }),
  label: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '8px' },
  filename: { fontSize: '14px', color: '#16A34A', fontWeight: 600 },
  placeholder: { fontSize: '14px', color: '#94a3b8' },
  hint: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  btn: (enabled) => ({
    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
    background: enabled ? ORANGE : '#E2E8F0', color: enabled ? '#fff' : '#94a3b8',
    cursor: enabled ? 'pointer' : 'default', fontSize: '15px', fontWeight: 700,
    marginTop: '20px', transition: 'all 0.2s ease',
  }),
  demo: {
    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0',
    background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '13px',
    fontWeight: 600, marginTop: '10px',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' },
  line: { flex: 1, height: '1px', background: '#E2E8F0' },
  or: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' },
}

function DropZone({ label, file, onFile, accept }) {
  const [dragOver, setDragOver] = useState(false)
  const ref = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div>
      <div style={s.label}>{label}</div>
      <div
        style={s.dropzone(dragOver, !!file)}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <div style={s.filename}>{file.name}</div>
        ) : (
          <>
            <div style={s.placeholder}>Arrastra un fichero aquí o haz clic para seleccionar</div>
            <div style={s.hint}>.xlsx o .csv</div>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept={accept || ".xlsx,.xls,.csv"}
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]) }}
        />
      </div>
    </div>
  )
}

export default function Upload({ onUpload, onDemo, error }) {
  const [fileA, setFileA] = useState(null)
  const [fileB, setFileB] = useState(null)

  const canSubmit = fileA && fileB

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Logo />
        <div style={s.tag}>Motor de Reconciliación</div>
        <h1 style={s.title}>
          Cuadre <span style={s.bold}>Estadística de Venta vs Contabilidad</span>
        </h1>
        <p style={s.sub}>
          Sube los dos ficheros del cierre contable. El sistema los cruzará automáticamente,
          detectará discrepancias y te ayudará a cerrar el cuadre.
        </p>

        {error && <div style={s.error}>{error}</div>}

        <DropZone
          label="Fichero A — Estadística de Venta"
          file={fileA}
          onFile={setFileA}
        />
        <DropZone
          label="Fichero B — Contabilidad"
          file={fileB}
          onFile={setFileB}
        />

        <button
          style={s.btn(canSubmit)}
          onClick={() => canSubmit && onUpload(fileA, fileB)}
          disabled={!canSubmit}
        >
          Analizar y cuadrar
        </button>

        <div style={s.divider}>
          <div style={s.line} />
          <span style={s.or}>o</span>
          <div style={s.line} />
        </div>

        <button style={s.demo} onClick={onDemo}>
          Ver demo con datos de ejemplo
        </button>
      </div>
    </div>
  )
}
