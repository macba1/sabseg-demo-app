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
  dropzone: (active, hasFiles) => ({
    border: `2px dashed ${active ? ORANGE : hasFiles ? '#86efac' : '#E2E8F0'}`,
    borderRadius: '14px', padding: '28px 24px', textAlign: 'center', cursor: 'pointer',
    background: active ? '#E8721A08' : hasFiles ? '#f0fdf4' : '#F8F9FA',
    transition: 'all 0.2s ease', marginBottom: '12px',
  }),
  filename: { fontSize: '13px', color: '#16A34A', fontWeight: 600 },
  placeholder: { fontSize: '14px', color: '#94a3b8' },
  hint: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  btn: (enabled) => ({
    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
    background: enabled ? ORANGE : '#E2E8F0', color: enabled ? '#fff' : '#94a3b8',
    cursor: enabled ? 'pointer' : 'default', fontSize: '15px', fontWeight: 700,
    marginTop: '20px', transition: 'all 0.2s ease',
  }),
  demo: {
    width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${ORANGE}`,
    background: '#E8721A10', color: ORANGE, cursor: 'pointer', fontSize: '13px',
    fontWeight: 600, marginTop: '10px',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' },
  line: { flex: 1, height: '1px', background: '#E2E8F0' },
  or: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' },
  back: { display: 'inline-block', fontSize: '13px', color: '#64748b', cursor: 'pointer', marginBottom: '16px' },
}

export default function DataQualityUpload({ onUpload, onDemo, onBack, error }) {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const ref = useRef()

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles)
    setFiles(prev => [...prev, ...arr])
  }

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Logo />
        {onBack && <div style={s.back} onClick={onBack}>← Volver a la Landing</div>}
        <div style={s.tag}>Data Quality</div>
        <h1 style={s.title}>
          Validacion <span style={s.bold}>de Ficheros de Recibos</span>
        </h1>
        <p style={s.sub}>
          Sube los ficheros de recibos de las corredurias. El sistema detectara errores,
          propondra correcciones automaticas y generara textos para informar a las corredurias.
        </p>

        {error && <div style={s.error}>{error}</div>}

        <div
          style={s.dropzone(dragOver, files.length > 0)}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          {files.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={s.filename}>{f.name}</span>
                  <span onClick={e => { e.stopPropagation(); removeFile(i) }} style={{ color: '#DC2626', cursor: 'pointer', fontSize: '12px' }}>x</span>
                </div>
              ))}
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Haz clic para anadir mas ficheros</div>
            </div>
          ) : (
            <>
              <div style={s.placeholder}>Arrastra ficheros aqui o haz clic para seleccionar</div>
              <div style={s.hint}>.xlsx (uno o varios ficheros de recibos)</div>
            </>
          )}
          <input ref={ref} type="file" accept=".xlsx,.xls" multiple style={{ display: 'none' }}
            onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
        </div>

        <button
          style={s.btn(files.length > 0)}
          onClick={() => files.length > 0 && onUpload(files)}
          disabled={files.length === 0}
        >
          Validar {files.length} fichero{files.length !== 1 ? 's' : ''}
        </button>

        <div style={s.divider}>
          <div style={s.line} />
          <span style={s.or}>o</span>
          <div style={s.line} />
        </div>

        <button style={s.demo} onClick={onDemo}>
          Ver demo con datos reales de Sabseg
        </button>
      </div>
    </div>
  )
}
