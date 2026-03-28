import { useState, useCallback } from 'react'
import { colors, card, shadows, btnPrimary } from '../../theme'

function getFileIcon(name) {
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return '📊'
  if (name.endsWith('.csv')) return '📋'
  if (name.endsWith('.pdf')) return '📄'
  return '📎'
}

function getFileType(name) {
  const lower = name.toLowerCase()
  if (lower.includes('saldo')) return { label: 'Saldos', color: colors.blue, bg: colors.blueBg }
  if (lower.includes('estadistica') || lower.includes('2026_02') || lower.includes('02_2026')) return { label: 'Estadísticas', color: colors.teal, bg: '#F0FDFA' }
  if (lower.includes('recibo') || lower.includes('arrenta') || lower.includes('maura')) return { label: 'Recibos', color: colors.purple, bg: '#F5F3FF' }
  if (lower.includes('araytor') || lower.includes('zurriola') || lower.includes('seguretxe'))
    return { label: 'Recibos', color: colors.purple, bg: '#F5F3FF' }
  return { label: 'Datos', color: colors.gray, bg: colors.bg }
}

function getFileSize() {
  return (Math.floor(Math.random() * 400) + 50) + ' KB'
}

function FileCard({ file, onRemove, animating }) {
  const type = getFileType(file.name)
  return (
    <div style={{
      ...card,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      opacity: animating ? 0 : 1,
      transform: animating ? 'translateY(8px)' : 'translateY(0)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    }}>
      <span style={{ fontSize: '20px' }}>{getFileIcon(file.name)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: colors.navy,
          fontSize: '13px',
          fontWeight: '500',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{file.name}</div>
        <div style={{ color: colors.grayLight, fontSize: '11px', marginTop: '2px' }}>
          {file.size}
        </div>
      </div>
      <div style={{
        padding: '3px 8px',
        borderRadius: '6px',
        background: type.bg,
        border: `1px solid ${type.color}20`,
      }}>
        <span style={{ color: type.color, fontSize: '11px', fontWeight: '600' }}>
          {type.label}
        </span>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(file.name)}
          style={{
            background: 'none',
            border: 'none',
            color: colors.grayLight,
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
            lineHeight: 1,
            borderRadius: '4px',
          }}
          onMouseEnter={e => e.target.style.color = colors.red}
          onMouseLeave={e => e.target.style.color = colors.grayLight}
        >×</button>
      )}
    </div>
  )
}

export default function FileRepository({ sections, onRun, runLabel, variant }) {
  const [files, setFiles] = useState({})
  const [animatingFiles, setAnimatingFiles] = useState(new Set())
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const allFiles = Object.values(files).flat()
  const hasFiles = allFiles.length > 0

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleLoadDemo = useCallback(async () => {
    setLoadingDemo(true)
    const newFiles = {}
    const allNames = []

    for (const section of sections) {
      newFiles[section.id] = []
      for (const fileName of section.demoFiles) {
        allNames.push({ section: section.id, name: fileName })
      }
    }

    // Show files appearing one by one
    for (let i = 0; i < allNames.length; i++) {
      const { section, name } = allNames[i]
      const file = { name, size: getFileSize() }

      await new Promise(resolve => {
        setAnimatingFiles(prev => new Set(prev).add(name))
        newFiles[section] = [...(newFiles[section] || []), file]
        setFiles({ ...newFiles })

        setTimeout(() => {
          setAnimatingFiles(prev => {
            const next = new Set(prev)
            next.delete(name)
            return next
          })
          resolve()
        }, 80)
      })
    }

    setLoadingDemo(false)
  }, [sections])

  const handleRemoveFile = useCallback((sectionId, fileName) => {
    setFiles(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter(f => f.name !== fileName),
    }))
  }, [])

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          ...card,
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          border: dragOver
            ? `2px dashed ${colors.orange}`
            : `2px dashed ${colors.border}`,
          background: dragOver ? 'rgba(232,114,26,0.03)' : colors.white,
          borderRadius: '12px',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.6 }}>📁</div>
        <p style={{
          color: colors.navy,
          fontSize: '15px',
          fontWeight: '600',
          marginBottom: '4px',
        }}>Arrastra tus ficheros aquí</p>
        <p style={{
          color: colors.grayLight,
          fontSize: '13px',
          marginBottom: '16px',
        }}>Excel, CSV o PDF</p>
        <button
          onClick={handleLoadDemo}
          disabled={loadingDemo || hasFiles}
          style={{
            background: hasFiles ? colors.bg : colors.navy,
            color: hasFiles ? colors.grayLight : colors.white,
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: hasFiles ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            opacity: loadingDemo ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (!hasFiles && !loadingDemo) e.target.style.background = colors.navyLight
          }}
          onMouseLeave={e => {
            if (!hasFiles) e.target.style.background = colors.navy
          }}
        >
          {loadingDemo ? 'Cargando...' : hasFiles ? 'Ficheros cargados' : 'Cargar ficheros de demostración'}
        </button>
      </div>

      {/* File sections */}
      {sections.map(section => {
        const sectionFiles = files[section.id] || []
        if (sectionFiles.length === 0) return null

        return (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <span style={{ fontSize: '14px' }}>{section.icon}</span>
              <h3 style={{
                color: colors.navy,
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>{section.label}</h3>
              <span style={{
                color: colors.grayLight,
                fontSize: '12px',
              }}>({sectionFiles.length})</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '8px',
            }}>
              {sectionFiles.map(f => (
                <FileCard
                  key={f.name}
                  file={f}
                  onRemove={() => handleRemoveFile(section.id, f.name)}
                  animating={animatingFiles.has(f.name)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Run button */}
      {hasFiles && (
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          animation: 'fadeIn 0.4s ease',
        }}>
          <button
            onClick={onRun}
            style={{
              ...btnPrimary,
              padding: '16px 48px',
              fontSize: '16px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(232,114,26,0.3)',
            }}
            onMouseEnter={e => e.target.style.background = colors.orangeHover}
            onMouseLeave={e => e.target.style.background = colors.orange}
          >
            {runLabel}
          </button>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  )
}
