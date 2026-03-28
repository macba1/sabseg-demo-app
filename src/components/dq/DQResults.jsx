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
  const sev = issue.correccion_auto ? 'auto-fix' : issue.severidad === 'error' ? 'error' : 'warning'

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
          <span style={{ color: colors.navy, fontSize: '13px', fontWeight: '500' }}>{issue.tipo}</span>
          <span style={{ color: colors.grayLight, fontSize: '12px' }}>({issue.cantidad} caso{issue.cantidad !== 1 ? 's' : ''})</span>
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
  const allIssues = [...(result.errors || []), ...(result.warnings || []), ...(result.corrections || [])]
  const errorCount = (result.errors || []).reduce((s, e) => s + (e.cantidad || 0), 0)
  const warnCount = (result.warnings || []).reduce((s, w) => s + (w.cantidad || 0), 0)
  const autoCount = result.auto_correctable || 0

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
          {(data.issues || []).map((issue, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              borderRadius: '6px',
              background: issue.severidad === 'error' ? colors.redBg : colors.yellowBg,
              border: `1px solid ${issue.severidad === 'error' ? colors.redBorder : colors.yellowBorder}`,
              marginBottom: '6px',
              fontSize: '13px',
              color: issue.severidad === 'error' ? colors.red : colors.yellow,
            }}>
              <strong>{issue.tipo}</strong>: {issue.detalle}
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
  const [actionError, setActionError] = useState(null)

  const results = data.results || []

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

  return (
    <div id="results-section">
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <KPI label="Ficheros" value={data.total_files || 0} />
        <KPI label="Registros" value={data.total_records || 0} />
        <KPI label="Errores" value={data.total_errors || 0} color={colors.red} />
        <KPI label="Warnings" value={data.total_warnings || 0} color={colors.yellow} />
        <KPI label="Auto-corregibles" value={data.auto_correctable || 0} color={colors.green} />
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
      </div>

      <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />

      {/* Corrections results */}
      {correctionsData && (
        <div style={{ ...card, marginTop: '16px', padding: '20px 24px' }}>
          <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Correcciones aplicadas
          </h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: colors.greenBg, padding: '10px 16px', borderRadius: '6px' }}>
              <span style={{ color: colors.gray, fontSize: '12px' }}>Correcciones</span>
              <p style={{ color: colors.green, fontSize: '24px', fontWeight: '700' }}>{correctionsData.total_corrections}</p>
            </div>
            <div style={{ background: colors.yellowBg, padding: '10px 16px', borderRadius: '6px' }}>
              <span style={{ color: colors.gray, fontSize: '12px' }}>Pendientes</span>
              <p style={{ color: colors.yellow, fontSize: '24px', fontWeight: '700' }}>{correctionsData.total_remaining}</p>
            </div>
          </div>
          {(correctionsData.results || []).map((r, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <h4 style={{ color: colors.navy, fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                {r.correduria || r.filename}
              </h4>
              {(r.corrections_applied || []).map((c, j) => (
                <div key={j} style={{
                  padding: '8px 12px', borderRadius: '6px', background: colors.greenBg,
                  border: `1px solid ${colors.greenBorder}`, marginBottom: '4px', fontSize: '13px', color: colors.navy,
                }}>
                  ✓ {c.tipo} — {c.detalle}
                </div>
              ))}
              {(r.remaining_issues || []).map((ri, j) => (
                <div key={j} style={{
                  padding: '8px 12px', borderRadius: '6px', background: colors.yellowBg,
                  border: `1px solid ${colors.yellowBorder}`, marginBottom: '4px', fontSize: '13px', color: colors.yellow,
                }}>
                  ⚠ {ri.tipo} — {ri.detalle}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Reports results */}
      {reportsData && (
        <div style={{ ...card, marginTop: '16px', padding: '20px 24px' }}>
          <h3 style={{ color: colors.navy, fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Informes generados
          </h3>
          {(reportsData.reports || []).map((report, i) => (
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
