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
    borderRadius: '14px', padding: '20px 24px', textAlign: 'center', cursor: 'pointer',
    background: active ? '#E8721A08' : hasFile ? '#f0fdf4' : '#F8F9FA',
    transition: 'all 0.2s ease', marginBottom: '10px',
  }),
  label: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '6px' },
  filename: { fontSize: '14px', color: '#16A34A', fontWeight: 600 },
  placeholder: { fontSize: '13px', color: '#94a3b8' },
  hint: { fontSize: '11px', color: '#94a3b8', marginTop: '3px' },
  btn: (enabled) => ({
    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
    background: enabled ? ORANGE : '#E2E8F0', color: enabled ? '#fff' : '#94a3b8',
    cursor: enabled ? 'pointer' : 'default', fontSize: '15px', fontWeight: 700,
    marginTop: '16px', transition: 'all 0.2s ease',
  }),
  demo: {
    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0',
    background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '13px',
    fontWeight: 600, marginTop: '10px',
  },
  addBtn: {
    width: '100%', padding: '10px', borderRadius: '10px', border: '1px dashed #c7d2fe',
    background: '#eef2ff', color: '#4338ca', cursor: 'pointer', fontSize: '13px',
    fontWeight: 600, marginBottom: '10px',
  },
  removeBtn: {
    fontSize: '11px', color: '#DC2626', background: 'none', border: 'none',
    cursor: 'pointer', padding: '2px 4px', marginLeft: '8px',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' },
  line: { flex: 1, height: '1px', background: '#E2E8F0' },
  or: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' },
  back: { display: 'inline-block', fontSize: '13px', color: '#64748b', cursor: 'pointer', marginBottom: '16px' },
}

function DropZone({ label, file, onFile, onRemove, accept }) {
  const [dragOver, setDragOver] = useState(false)
  const ref = useRef()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={s.label}>{label}</div>
        {onRemove && <button style={s.removeBtn} onClick={onRemove}>Quitar</button>}
      </div>
      <div
        style={s.dropzone(dragOver, !!file)}
        onClick={() => ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]) }}
      >
        {file ? <div style={s.filename}>{file.name}</div> : (
          <>
            <div style={s.placeholder}>Arrastra un fichero o haz clic</div>
            <div style={s.hint}>.xlsx o .csv</div>
          </>
        )}
        <input ref={ref} type="file" accept={accept || ".xlsx,.xls,.csv"} style={{ display: 'none' }}
          onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]) }} />
      </div>
    </div>
  )
}

export default function NormalizeUpload({ onAnalyze, onDemo, onBack, error }) {
  const [files, setFiles] = useState([null])

  const setFile = (idx, f) => setFiles(p => p.map((v, i) => i === idx ? f : v))
  const addSlot = () => { if (files.length < 3) setFiles(p => [...p, null]) }
  const removeSlot = (idx) => setFiles(p => p.filter((_, i) => i !== idx))

  const validFiles = files.filter(Boolean)
  const canSubmit = validFiles.length >= 1

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Logo />
        <div style={s.back} onClick={onBack}>← Volver a la Landing</div>
        <div style={s.tag}>Motor de Homogeneización</div>
        <h1 style={s.title}>
          Normalización <span style={s.bold}>de Datos de Corredurías</span>
        </h1>
        <p style={s.sub}>
          Sube de 1 a 3 ficheros de corredurías adquiridas. El sistema detectará el idioma,
          mapeará columnas al modelo canónico y generará un informe de calidad.
        </p>

        {error && <div style={s.error}>{error}</div>}

        {files.map((file, i) => (
          <DropZone
            key={i}
            label={`Correduría ${i + 1}`}
            file={file}
            onFile={f => setFile(i, f)}
            onRemove={files.length > 1 ? () => removeSlot(i) : undefined}
          />
        ))}

        {files.length < 3 && (
          <button style={s.addBtn} onClick={addSlot}>
            + Añadir otra correduría
          </button>
        )}

        <button
          style={s.btn(canSubmit)}
          onClick={() => canSubmit && onAnalyze(validFiles)}
          disabled={!canSubmit}
        >
          Analizar {validFiles.length} fichero{validFiles.length !== 1 ? 's' : ''}
        </button>

        <div style={s.divider}>
          <div style={s.line} />
          <span style={s.or}>o</span>
          <div style={s.line} />
        </div>

        <button style={s.demo} onClick={onDemo}>
          Ver demo con datos de ejemplo (ES / PT / IT)
        </button>
      </div>
    </div>
  )
}
