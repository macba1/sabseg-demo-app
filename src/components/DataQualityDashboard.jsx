import { useState } from 'react'
import Logo from './Logo'

const ORANGE = '#E8721A'

const sevColors = {
  Alta:  { bg: '#fef2f2', text: '#DC2626', border: '#fca5a5', dot: '#DC2626' },
  Media: { bg: '#fffbeb', text: '#F59E0B', border: '#fcd34d', dot: '#F59E0B' },
  Baja:  { bg: '#f0fdf4', text: '#16A34A', border: '#86efac', dot: '#16A34A' },
}

const cs = {
  page: { minHeight: '100vh', background: '#FFFFFF', padding: '32px 20px' },
  wrap: { maxWidth: '1100px', margin: '0 auto' },
  panel: { background: '#F8F9FA', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px' },
  lbl: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '6px' },
}

function SevBadge({ severidad }) {
  const c = sevColors[severidad] || sevColors.Baja
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '2px 9px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot }} />
      {severidad}
    </span>
  )
}

function TypeIcon({ type }) {
  if (type === 'error') return <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '14px' }}>!</span>
  if (type === 'warning') return <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '14px' }}>?</span>
  return <span style={{ color: '#16A34A', fontWeight: 700, fontSize: '14px' }}>A</span>
}

function IssueCard({ issue, type }) {
  const [open, setOpen] = useState(false)
  const isAutoFix = issue.correccion_auto
  const sev = sevColors[issue.severidad] || sevColors.Baja

  // Determine row color based on type
  const rowBg = type === 'correction' ? '#f0fdf4' : type === 'error' ? '#FFFFFF' : '#FFFFFF'
  const leftBorder = type === 'correction' ? '#16A34A' : type === 'error' ? sev.dot : '#F59E0B'

  return (
    <div style={{
      background: rowBg, borderRadius: '10px', border: '1px solid #E2E8F0',
      borderLeft: `4px solid ${leftBorder}`, marginBottom: '8px', overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
        }}
      >
        <TypeIcon type={type} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A' }}>{issue.tipo}</span>
            <SevBadge severidad={issue.severidad} />
            {isAutoFix && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: '#16A34A', background: '#f0fdf4',
                border: '1px solid #86efac', borderRadius: '4px', padding: '1px 6px',
              }}>AUTO-FIX</span>
            )}
            {issue.para_correo && (
              <span style={{
                fontSize: '10px', fontWeight: 700, color: '#2563eb', background: '#eff6ff',
                border: '1px solid #bfdbfe', borderRadius: '4px', padding: '1px 6px',
              }}>CORREO</span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Campo: <strong>{issue.campo}</strong> · {issue.cantidad} caso{issue.cantidad !== 1 ? 's' : ''}
          </div>
        </div>
        <span style={{ color: '#94a3b8', fontSize: '16px', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </div>

      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
          {/* Detalle */}
          <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Detalle</div>
            <div style={{ fontSize: '13px', color: '#1B2A4A', lineHeight: 1.6 }}>{issue.detalle}</div>
          </div>

          {/* Valores ejemplo */}
          {issue.valores && issue.valores.length > 0 && (
            <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Valores</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {issue.valores.map((v, i) => (
                  <span key={i} style={{
                    fontSize: '11px', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px',
                    background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1B2A4A',
                  }}>{String(v)}</span>
                ))}
              </div>
            </div>
          )}

          {/* Ejemplos NIF */}
          {issue.ejemplos && issue.ejemplos.length > 0 && (
            <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Ejemplos</div>
              {issue.ejemplos.map((e, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#1B2A4A', marginBottom: '4px' }}>
                  <code style={{ color: '#DC2626' }}>{e.value}</code>
                  {e.suggestion && <span style={{ color: '#64748b' }}> → {e.suggestion}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Sugerencia */}
          <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2563eb', marginBottom: '4px', fontWeight: 700 }}>Sugerencia</div>
            <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.6 }}>{issue.sugerencia}</div>
          </div>

          {/* Texto para correo */}
          {issue.para_correo && (
            <div style={{ background: '#faf5ff', borderRadius: '8px', padding: '12px 14px', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7c3aed', marginBottom: '4px', fontWeight: 700 }}>Texto para correo a correduria</div>
              <div style={{ fontSize: '13px', color: '#6b21a8', lineHeight: 1.6, fontStyle: 'italic' }}>"{issue.para_correo}"</div>
              <button
                onClick={() => navigator.clipboard.writeText(issue.para_correo)}
                style={{
                  marginTop: '8px', padding: '4px 12px', borderRadius: '6px', fontSize: '11px',
                  border: '1px solid #e9d5ff', background: '#FFFFFF', color: '#7c3aed',
                  cursor: 'pointer', fontWeight: 600,
                }}
              >Copiar texto</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FileSection({ result, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)

  if (result.error) {
    return (
      <div style={{ ...cs.panel, padding: '16px 20px', borderLeft: '4px solid #DC2626' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>{result.filename}</div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>Error: {result.error}</div>
      </div>
    )
  }

  const allIssues = [
    ...(result.errors || []).map(e => ({ ...e, _type: 'error' })),
    ...(result.warnings || []).map(w => ({ ...w, _type: 'warning' })),
    ...(result.corrections || []).map(c => ({ ...c, _type: 'correction' })),
  ]

  const healthColor = result.total_errors === 0 && result.total_warnings === 0
    ? '#16A34A' : result.total_errors > 3 ? '#DC2626' : '#F59E0B'

  return (
    <div style={{ ...cs.panel, padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '18px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
          borderBottom: open ? '1px solid #E2E8F0' : 'none',
        }}
      >
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%', background: healthColor, flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B2A4A' }}>
            {result.correduria || result.filename}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {result.filename} · {result.total_records} registros · {result.total_columns} columnas
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {result.total_errors > 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>
              {result.total_errors} error{result.total_errors !== 1 ? 'es' : ''}
            </span>
          )}
          {result.total_warnings > 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>
              {result.total_warnings} warning{result.total_warnings !== 1 ? 's' : ''}
            </span>
          )}
          {result.total_corrections > 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
              {result.total_corrections} auto-fix
            </span>
          )}
          {result.total_errors === 0 && result.total_warnings === 0 && result.total_corrections === 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>Sin incidencias</span>
          )}
        </div>
        <span style={{ color: '#94a3b8', fontSize: '16px', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </div>

      {open && (
        <div style={{ padding: '16px 24px' }}>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Auto-corregible: <strong style={{ color: '#16A34A' }}>{result.auto_correctable}</strong>
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Revision manual: <strong style={{ color: '#DC2626' }}>{result.needs_review}</strong>
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Calidad: <strong style={{ color: healthColor }}>{result.pct_clean}%</strong>
            </span>
          </div>

          {allIssues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#16A34A', fontWeight: 600 }}>
              Sin incidencias detectadas
            </div>
          ) : (
            allIssues.map((issue, i) => (
              <IssueCard key={issue.id || i} issue={issue} type={issue._type} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function ArrentaComparison({ comparison }) {
  if (!comparison || comparison.error) return null

  return (
    <div style={{ ...cs.panel, borderLeft: `4px solid ${ORANGE}` }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: ORANGE, fontWeight: 700, marginBottom: '12px' }}>
        Comparacion Arrenta — Enero vs Febrero
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Registros Enero</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>{comparison.records_jan}</div>
        </div>
        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Registros Febrero</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>{comparison.records_feb}</div>
        </div>
        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Diferencia</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: comparison.records_feb >= comparison.records_jan ? '#16A34A' : '#DC2626' }}>
            {comparison.records_feb >= comparison.records_jan ? '+' : ''}{comparison.records_feb - comparison.records_jan}
          </div>
        </div>
      </div>

      {comparison.issues && comparison.issues.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comparison.issues.map((issue, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px',
              background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0',
              borderLeft: `3px solid ${sevColors[issue.severidad]?.dot || '#F59E0B'}`,
            }}>
              <SevBadge severidad={issue.severidad} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>{issue.tipo}</div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{issue.detalle}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
          Sin discrepancias entre periodos
        </div>
      )}
    </div>
  )
}

export default function DataQualityDashboard({ data, onBack }) {
  const results = data.results || []

  return (
    <div style={cs.page}>
      <div style={cs.wrap}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: ORANGE, fontWeight: 700, marginBottom: '6px' }}>
              Data Quality — Resultados
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 300, margin: 0, color: '#1B2A4A' }}>
              Validacion <span style={{ fontWeight: 700 }}>de Ficheros de Recibos</span>
            </h1>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              {data.fecha_analisis} · {data.total_files} ficheros · {data.total_records?.toLocaleString('es-ES')} registros
            </div>
          </div>
          <button onClick={onBack} style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            border: '1px solid #E2E8F0', background: 'transparent', color: '#64748b', cursor: 'pointer',
          }}>← Volver</button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {[
            { l: 'Ficheros', v: data.total_files, c: '#1B2A4A' },
            { l: 'Registros', v: (data.total_records || 0).toLocaleString('es-ES'), c: '#1B2A4A' },
            { l: 'Errores', v: data.total_errors, c: data.total_errors > 0 ? '#DC2626' : '#16A34A' },
            { l: 'Warnings', v: data.total_warnings, c: data.total_warnings > 0 ? '#F59E0B' : '#16A34A' },
            { l: 'Auto-corregible', v: data.auto_correctable, c: '#16A34A' },
            { l: 'Revision manual', v: data.needs_manual_review, c: data.needs_manual_review > 0 ? '#DC2626' : '#16A34A' },
          ].map(c => (
            <div key={c.l} style={cs.panel}>
              <div style={cs.lbl}>{c.l}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: c.c }}>{c.v}</div>
            </div>
          ))}
        </div>

        {/* Per-file sections */}
        {results.map((r, i) => (
          <FileSection key={i} result={r} defaultOpen={i === 0} />
        ))}

        {/* Arrenta comparison */}
        {data.arrenta_comparison && (
          <ArrentaComparison comparison={data.arrenta_comparison} />
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Motor de Data Quality · Sabseg
        </div>
      </div>
    </div>
  )
}
