import { useState } from 'react'
import { colors, card, btnPrimary, btnSecondary } from '../../theme'
import SeverityBadge from '../shared/SeverityBadge'
import ErrorBanner from '../shared/ErrorBanner'

function KPI({ label, value, color }) {
  return (
    <div style={{ ...card, padding: '20px 24px', flex: 1, minWidth: '150px' }}>
      <p style={{ color: colors.gray, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</p>
      <p style={{ color: color || colors.navy, fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>{value}</p>
    </div>
  )
}

function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false)
  if (!issue) return null
  // Backend uses severidad: 'Alta', 'Media', 'Baja' — items from errors array
  // should show as 'error', from corrections as 'auto-fix', rest as 'warning'
  const sevLower = (issue.severidad || '').toLowerCase()
  const isError = sevLower === 'alta' || sevLower === 'media' || sevLower === 'error'
  const sev = issue.correccion_auto ? 'auto-fix' : isError ? 'error' : 'warning'

  return (
    <div style={{
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '8px',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: expanded ? colors.bg : colors.white,
          transition: 'background 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SeverityBadge severity={sev} />
          <span style={{ color: colors.navy, fontSize: '13px', fontWeight: '500' }}>{issue.tipo || ''}</span>
          <span style={{ color: colors.grayLight, fontSize: '12px' }}>({issue.cantidad ?? 0} caso{issue.cantidad !== 1 ? 's' : ''})</span>
        </div>
        <span style={{ color: colors.gray, fontSize: '14px', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>
      {expanded && (
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border}`, background: colors.bg }}>
          {issue.detalle && <p style={{ color: colors.navy, fontSize: '13px', marginBottom: '8px' }}>{issue.detalle}</p>}
          {issue.sugerencia && <p style={{ color: colors.gray, fontSize: '13px', marginBottom: '8px' }}>💡 {issue.sugerencia}</p>}
          {issue.para_correo && (
            <div style={{
              background: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              padding: '10px',
              marginTop: '8px',
            }}>
              <p style={{ color: colors.gray, fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Texto para correo:</p>
              <p style={{ color: colors.navy, fontSize: '13px', whiteSpace: 'pre-wrap' }}>{issue.para_correo}</p>
            </div>
          )}
          {issue.ejemplos && issue.ejemplos.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <p style={{ color: colors.gray, fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Ejemplos:</p>
              <div style={{ fontSize: '12px', color: colors.navy }}>
                {issue.ejemplos.slice(0, 5).map((ej, i) => (
                  <div key={i} style={{ padding: '2px 0' }}>
                    {typeof ej === 'string' ? ej : JSON.stringify(ej)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FileCard({ result }) {
  const [expanded, setExpanded] = useState(false)
  if (!result) return null
  const errors = (result.errors || []).filter(Boolean)
  const warnings = (result.warnings || []).filter(Boolean)
  const corrections = (result.corrections || []).filter(Boolean)
  const allIssues = [...errors, ...warnings, ...corrections]
  // Count by number of issue TYPES, not sum of cantidades
  // Errors that are auto-fix go in autoCount, the rest in errorCount
  const errorCount = errors.filter(e => !e.correccion_auto).length
  const warnCount = warnings.length
  const autoCount = errors.filter(e => e.correccion_auto).length + corrections.length

  return (
    <div style={{ ...card, marginBottom: '12px', overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = colors.bg}
        onMouseLeave={e => e.currentTarget.style.background = colors.white}
      >
        <div>
          <h3 style={{ color: colors.navy, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
            {result.correduria || result.filename}
          </h3>
          <span style={{ color: colors.grayLight, fontSize: '12px' }}>
            {result.filename} · {result.total_records} registros
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {errorCount > 0 && <span style={{ color: colors.red, fontSize: '12px', fontWeight: '600' }}>{errorCount} errores</span>}
          {warnCount > 0 && <span style={{ color: colors.yellow, fontSize: '12px', fontWeight: '600' }}>{warnCount} warnings</span>}
          {autoCount > 0 && <span style={{ color: colors.green, fontSize: '12px', fontWeight: '600' }}>{autoCount} auto-fix</span>}
          <span style={{ color: colors.gray, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 20px 16px 20px' }}>
          {allIssues.length === 0 && <p style={{ color: colors.green, fontSize: '13px' }}>Sin incidencias detectadas.</p>}
          {allIssues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
        </div>
      )}
    </div>
  )
}

function ArrentaComparison({ data }) {
  const [open, setOpen] = useState(false)
  if (!data) return null

  return (
    <div style={{ ...card, marginTop: '16px', overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <h3 style={{ color: colors.navy, fontSize: '15px', fontWeight: '600' }}>
          Comparación Arrenta Enero vs Febrero
        </h3>
        <span style={{ color: colors.gray, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '0 20px 16px 20px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <div style={{ background: colors.bg, padding: '10px 16px', borderRadius: '6px', flex: 1 }}>
              <span style={{ color: colors.gray, fontSize: '12px' }}>Registros Enero</span>
              <p style={{ color: colors.navy, fontSize: '20px', fontWeight: '600' }}>{data.records_jan}</p>
            </div>
            <div style={{ background: colors.bg, padding: '10px 16px', borderRadius: '6px', flex: 1 }}>
              <span style={{ color: colors.gray, fontSize: '12px' }}>Registros Febrero</span>
              <p style={{ color: colors.navy, fontSize: '20px', fontWeight: '600' }}>{data.records_feb}</p>
            </div>
          </div>
          {(data.issues || []).filter(Boolean).map((issue, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              borderRadius: '6px',
              background: issue?.severidad === 'error' ? colors.redBg : colors.yellowBg,
              border: `1px solid ${issue?.severidad === 'error' ? colors.redBorder : colors.yellowBorder}`,
              marginBottom: '6px',
              fontSize: '13px',
              color: issue?.severidad === 'error' ? colors.red : colors.yellow,
            }}>
              <strong>{issue?.tipo || ''}</strong>: {issue?.detalle || ''}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


function CorrectionsSection({ data: correctionsData }) {
  const [showDetail, setShowDetail] = useState(false)
  const fileResults = (correctionsData.results || []).filter(Boolean)
  const totalFiles = fileResults.length

  // Unique correction types across all files
  const typeSet = new Set()
  const allTypes = []
  fileResults.forEach(r => {
    (r.corrections_applied || []).filter(Boolean).forEach(c => {
      const tipo = c?.tipo || ''
      if (tipo && !typeSet.has(tipo)) {
        typeSet.add(tipo)
        allTypes.push(tipo)
      }
    })
  })

  const totalRemaining = correctionsData.total_remaining || 0

  return (
    <div style={{ ...card, marginTop: '16px', padding: '20px 24px' }}>
      <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
        Correcciones aplicadas
      </h3>

      <p style={{ color: colors.navy, fontSize: '14px', marginBottom: '16px' }}>
        Se corrigieron automáticamente <strong style={{ color: colors.green }}>{allTypes.length} tipos de errores</strong> en {totalFiles} ficheros
      </p>

      {/* Unique correction types */}
      <div style={{ marginBottom: '16px' }}>
        {allTypes.map((tipo, i) => (
          <div key={i} style={{
            padding: '8px 12px', borderRadius: '6px', background: colors.greenBg,
            border: `1px solid ${colors.greenBorder}`, marginBottom: '4px', fontSize: '13px', color: colors.navy,
          }}>
            ✓ {tipo}
          </div>
        ))}
      </div>

      {/* Remaining */}
      {totalRemaining > 0 && (
        <p style={{ color: colors.orange, fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          Pendientes de revisión manual: {totalRemaining} registros
        </p>
      )}

      {/* Toggle detail by file */}
      <button
        onClick={() => setShowDetail(!showDetail)}
        style={{
          background: 'none', border: 'none', color: colors.gray,
          fontSize: '13px', cursor: 'pointer', padding: '4px 0',
          textDecoration: 'underline',
        }}
      >
        {showDetail ? 'Ocultar detalle por fichero' : 'Ver detalle por fichero'}
      </button>

      {showDetail && (
        <div style={{ marginTop: '12px' }}>
          {fileResults.map((r, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <h4 style={{ color: colors.navy, fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                {r.correduria || r.filename}
              </h4>
              {(r.corrections_applied || []).filter(Boolean).map((c, j) => (
                <div key={j} style={{
                  padding: '6px 12px', borderRadius: '6px', background: colors.greenBg,
                  border: `1px solid ${colors.greenBorder}`, marginBottom: '3px', fontSize: '12px', color: colors.navy,
                }}>
                  ✓ {c?.tipo || ''} — {c?.detalle || ''}
                </div>
              ))}
              {(r.remaining_issues || []).filter(Boolean).map((ri, j) => (
                <div key={j} style={{
                  padding: '6px 12px', borderRadius: '6px', background: colors.yellowBg,
                  border: `1px solid ${colors.yellowBorder}`, marginBottom: '3px', fontSize: '12px', color: colors.yellow,
                }}>
                  ⚠ {ri?.tipo || ''} — {ri?.detalle || ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DQResults({ data, apiUrl, apiCall }) {
  const [correctionsData, setCorrectionsData] = useState(null)
  const [reportsData, setReportsData] = useState(null)
  const [loadingCorrections, setLoadingCorrections] = useState(false)
  const [loadingReports, setLoadingReports] = useState(false)
  const [loadingLog, setLoadingLog] = useState(false)
  const [actionError, setActionError] = useState(null)

  if (!data) return null

  const results = (data.results || []).filter(Boolean)

  // Compute KPI counts consistent with card counts (by issue type, not registro count)
  let kpiErrors = 0, kpiWarnings = 0, kpiAutoFix = 0
  results.forEach(r => {
    const errors = (r.errors || []).filter(Boolean)
    kpiErrors += errors.filter(e => !e.correccion_auto).length
    kpiAutoFix += errors.filter(e => e.correccion_auto).length + (r.corrections || []).filter(Boolean).length
    kpiWarnings += (r.warnings || []).filter(Boolean).length
  })

  const handleCorrections = async () => {
    setLoadingCorrections(true); setActionError(null)
    try {
      const res = await apiCall(`${apiUrl}/api/apply-corrections-demo`, { method: 'POST' })
      setCorrectionsData(res)
    } catch (e) { setActionError(e.message) }
    setLoadingCorrections(false)
  }

  const handleReports = async () => {
    setLoadingReports(true); setActionError(null)
    try {
      const res = await apiCall(`${apiUrl}/api/generate-reports-demo`, { method: 'POST' })
      setReportsData(res)
    } catch (e) { setActionError(e.message) }
    setLoadingReports(false)
  }

  const handleDownloadLog = async () => {
    setLoadingLog(true); setActionError(null)
    try {
      const response = await fetch(`${apiUrl}/api/download-log-demo`, { method: 'POST' })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'log_incidencias_sabseg.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e) { setActionError(e.message) }
    setLoadingLog(false)
  }

  return (
    <div id="results-section">
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <KPI label="Ficheros" value={data.total_files || 0} />
        <KPI label="Registros" value={data.total_records || 0} />
        <KPI label="Errores" value={kpiErrors} color={colors.red} />
        <KPI label="Warnings" value={kpiWarnings} color={colors.yellow} />
        <KPI label="Auto-corregibles" value={kpiAutoFix} color={colors.green} />
      </div>

      {/* Resumen ejecutivo */}
      <h2 style={{ color: colors.navy, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
        Análisis por correduría
      </h2>
      {results.map((r, i) => <FileCard key={i} result={r} />)}

      <ArrentaComparison data={data.arrenta_comparison} />

      {/* Actions */}
      <div style={{
        ...card,
        marginTop: '24px',
        padding: '20px 24px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: colors.navy, fontSize: '14px', fontWeight: '600', marginRight: '8px' }}>Acciones:</span>
        <button
          onClick={handleCorrections}
          disabled={loadingCorrections}
          style={{ ...btnPrimary, opacity: loadingCorrections ? 0.6 : 1 }}
          onMouseEnter={e => { if (!loadingCorrections) e.target.style.background = '#D4650F' }}
          onMouseLeave={e => e.target.style.background = colors.orange}
        >
          {loadingCorrections ? 'Aplicando...' : 'Aplicar correcciones automáticas'}
        </button>
        <button
          onClick={handleReports}
          disabled={loadingReports}
          style={{ ...btnSecondary, opacity: loadingReports ? 0.6 : 1 }}
        >
          {loadingReports ? 'Generando...' : 'Generar informes para corredurías'}
        </button>
        <button
          onClick={handleDownloadLog}
          disabled={loadingLog}
          style={{
            ...btnSecondary,
            opacity: loadingLog ? 0.6 : 1,
          }}
        >
          {loadingLog ? 'Descargando...' : 'Descargar log detallado (Excel)'}
        </button>
      </div>

      <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />

      {/* Corrections results */}
      {correctionsData && <CorrectionsSection data={correctionsData} />}

      {/* Reports results */}
      {reportsData && (
        <div style={{ ...card, marginTop: '16px', padding: '20px 24px' }}>
          <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Informes generados
          </h3>
          {(reportsData.reports || []).filter(Boolean).map((report, i) => (
            <div key={i} style={{
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              marginBottom: '12px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 16px',
                background: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h4 style={{ color: colors.navy, fontSize: '14px', fontWeight: '600' }}>
                    {report.correduria}
                  </h4>
                  <p style={{ color: colors.grayLight, fontSize: '12px', marginTop: '2px' }}>
                    {report.tiene_incidencias ? `${report.total_incidencias} incidencia(s)` : 'Sin incidencias'}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(report.cuerpo_email || '')}
                  style={{
                    ...btnSecondary,
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  Copiar
                </button>
              </div>
              <div style={{ padding: '16px' }}>
                <p style={{ color: colors.gray, fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Asunto: {report.asunto_email}
                </p>
                <pre style={{
                  background: colors.bg,
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: colors.navy,
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                  margin: 0,
                }}>
                  {report.cuerpo_email}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
