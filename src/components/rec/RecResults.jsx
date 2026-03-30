import React, { useState, useCallback, useMemo } from 'react'
import { colors, card, btnPrimary, btnSecondary } from '../../theme'
import StatusBadge from '../shared/StatusBadge'

const DECISION_COLORS = {
  cerrar: { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' },
  pendiente: { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' },
}

function KPI({ label, value, sub }) {
  const strVal = String(value || '')
  const isLong = strVal.length > 12
  return (
    <div style={{ ...card, padding: '20px 24px', flex: 1, minWidth: '200px' }}>
      <p style={{ color: colors.gray, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</p>
      <p style={{ color: colors.navy, fontSize: isLong ? '20px' : '28px', fontWeight: '700', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
      {sub && <p style={{ color: colors.grayLight, fontSize: '12px', marginTop: '4px' }}>{sub}</p>}
    </div>
  )
}

function DetailPanel({ row }) {
  return (
    <tr>
      <td colSpan={9} style={{ padding: '0' }}>
        <div style={{ background: colors.bg, padding: '16px 24px', borderBottom: `1px solid ${colors.border}` }}>
          {row.explicacion && (
            <p style={{ color: colors.navy, fontSize: '13px', marginBottom: '12px' }}>
              <strong>Explicación:</strong> {row.explicacion}
            </p>
          )}
          {row.detalle_contab && row.detalle_contab.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ color: colors.navy, fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Subcuentas contables:</p>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: colors.gray }}>Cuenta</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: colors.gray }}>Descripción</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px', color: colors.gray }}>Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {row.detalle_contab.filter(Boolean).map((d, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                      <td style={{ padding: '6px 8px', color: colors.navy }}>{d?.cuenta || d?.subcuenta || '-'}</td>
                      <td style={{ padding: '6px 8px', color: colors.gray }}>{d?.descripcion || d?.nombre || '-'}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: colors.navy }}>
                        {typeof d?.importe === 'number' ? d.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : (d?.importe ?? '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {row.recibos_analizados != null && (
            <p style={{ color: colors.gray, fontSize: '12px' }}>
              Recibos analizados: <strong style={{ color: colors.navy }}>{row.recibos_analizados}</strong>
            </p>
          )}
        </div>
      </td>
    </tr>
  )
}

function DecisionButton({ label, color, active, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: '600',
        borderRadius: '4px',
        border: `1px solid ${active ? color : colors.border}`,
        background: active ? color : colors.white,
        color: active ? colors.white : colors.gray,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >{label}</button>
  )
}

export default function RecResults({ data, apiUrl }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [cuentaFilter, setCuentaFilter] = useState('all')
  const [expandedRow, setExpandedRow] = useState(null)
  const [decisions, setDecisions] = useState({}) // { rowKey: 'cerrar'|'pendiente' }
  const [downloading, setDownloading] = useState(false)

  if (!data) return null

  const allRows = (data.reconciliacion || []).filter(Boolean)
  const rows = allRows.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (cuentaFilter !== 'all' && !r.cuenta?.startsWith(cuentaFilter)) return false
    return true
  })

  const fmt = v => typeof v === 'number' ? v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : '-'
  const pctFmt = v => typeof v === 'number' ? v.toFixed(1) + '%' : '-'

  const rowKey = (r) => String(r.id ?? `${r.empresa}-${r.mes || r.mes_label}-${r.cuenta || r.cuenta_label}`)

  // Progress
  const totalPartidas = allRows.length
  const resolved = Object.keys(decisions).length
  const resolvedPct = totalPartidas > 0 ? Math.round(resolved / totalPartidas * 100) : 0

  // Set of closed row keys — recalculated when decisions change
  const closedKeys = useMemo(() => {
    return new Set(Object.entries(decisions).filter(([, d]) => d === 'cerrar').map(([k]) => k))
  }, [decisions])

  // Dynamic pending differences by cuenta
  // Must use allRows index for rowKey, not filter index
  const pendiente705 = useMemo(() => {
    let sum = 0
    for (let i = 0; i < allRows.length; i++) {
      const r = allRows[i]
      if ((r.cuenta === '705' || r.cuenta_label?.includes('705')) && !closedKeys.has(rowKey(r)))
        sum += Math.abs(r.diferencia || 0)
    }
    return sum
  }, [allRows, closedKeys])

  const pendiente623 = useMemo(() => {
    let sum = 0
    for (let i = 0; i < allRows.length; i++) {
      const r = allRows[i]
      if ((r.cuenta === '623' || r.cuenta_label?.includes('623')) && !closedKeys.has(rowKey(r)))
        sum += Math.abs(r.diferencia || 0)
    }
    return sum
  }, [allRows, closedKeys])

  const setDecision = useCallback((key, decision) => {
    setDecisions(prev => {
      const next = { ...prev }
      if (decision === undefined) { delete next[key] } else { next[key] = decision }
      return next
    })
  }, [])

  const closeAllMatches = useCallback(() => {
    const updates = {}
    allRows.forEach((r, i) => {
      if (r.status === 'match' || r.status === 'warning') {
        updates[rowKey(r)] = 'cerrar'
      }
    })
    setDecisions(prev => ({ ...prev, ...updates }))
  }, [allRows])

  const handleDownloadExcel = async () => {
    setDownloading(true)
    try {
      const url = apiUrl || ''
      const response = await fetch(`${url}/api/export-reconciliation`, { method: 'POST' })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = 'reconciliacion_sabseg.xlsx'
      a.click()
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error('Download failed:', e)
    }
    setDownloading(false)
  }

  return (
    <div id="results-section">
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <KPI label="Empresas analizadas" value={data.empresas_analizadas || 0} />
        <KPI label="Partidas totales" value={data.total_partidas || 0} />
        <KPI label="% Cuadrado" value={pctFmt(data.pct_cuadrado)} />
        <KPI label="Pendiente 705 (Comisiones)" value={fmt(pendiente705)} />
        <KPI label="Pendiente 623 (Cedidas)" value={fmt(pendiente623)} />
      </div>

      {/* Progress bar */}
      <div style={{ ...card, padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: colors.navy, fontSize: '14px', fontWeight: '600' }}>
            Cierre: {resolved}/{totalPartidas} partidas resueltas ({resolvedPct}%)
          </span>
          {resolved > 0 && (
            <span style={{ color: colors.grayLight, fontSize: '12px' }}>
              {Object.values(decisions).filter(d => d === 'cerrar').length} cerradas,{' '}
              {Object.values(decisions).filter(d => d === 'pendiente').length} pendientes
            </span>
          )}
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: colors.bg, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${resolvedPct}%`,
            borderRadius: '3px',
            background: resolvedPct === 100 ? colors.green : colors.orange,
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{
        ...card,
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: colors.gray, fontSize: '13px', fontWeight: '600' }}>Filtros:</span>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '13px', color: colors.navy, background: colors.white }}>
          <option value="all">Todos los estados</option>
          <option value="match">Cuadrado</option>
          <option value="warning">Warning</option>
          <option value="mismatch">Discrepancia</option>
        </select>
        <select value={cuentaFilter} onChange={e => setCuentaFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${colors.border}`, fontSize: '13px', color: colors.navy, background: colors.white }}>
          <option value="all">Todas las cuentas</option>
          <option value="705">705 - Ventas</option>
          <option value="623">623 - Servicios</option>
        </select>
        <span style={{ color: colors.grayLight, fontSize: '12px' }}>{rows.length} resultados</span>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: colors.bg, borderBottom: `2px solid ${colors.border}` }}>
              {['Empresa', 'Mes', 'Cuenta', 'Estadística EUR', 'Contabilidad EUR', 'Diferencia EUR', '%', 'Estado', 'Decisión'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px',
                  textAlign: h.includes('EUR') || h === '%' ? 'right' : 'left',
                  color: colors.gray,
                  fontWeight: '600',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              if (!r) return null
              const key = rowKey(r)
              const decision = decisions[key]
              const dc = decision ? DECISION_COLORS[decision] : null
              return (
                <React.Fragment key={key}>
                  <tr
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                    style={{
                      borderBottom: `1px solid ${colors.borderLight}`,
                      cursor: 'pointer',
                      background: dc ? dc.bg : expandedRow === i ? colors.bg : colors.white,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!dc && expandedRow !== i) e.currentTarget.style.background = colors.bg }}
                    onMouseLeave={e => { if (!dc && expandedRow !== i) e.currentTarget.style.background = colors.white }}
                  >
                    <td style={{ padding: '10px 12px', color: colors.navy, fontWeight: '500' }}>{r.empresa}</td>
                    <td style={{ padding: '10px 12px', color: colors.gray }}>{r.mes_label || r.mes}</td>
                    <td style={{ padding: '10px 12px', color: colors.gray }}>{r.cuenta_label || r.cuenta}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: colors.navy }}>{fmt(r.estadistica)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: colors.navy }}>{fmt(r.contabilidad)}</td>
                    <td style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: r.diferencia > 0.01 || r.diferencia < -0.01 ? colors.red : colors.green,
                      fontWeight: '600',
                    }}>{fmt(r.diferencia)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: colors.gray }}>{pctFmt(r.pct)}</td>
                    <td style={{ padding: '10px 12px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '8px 8px', whiteSpace: 'nowrap' }}>
                      {decision === 'cerrar' ? (
                        <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); setDecision(key, undefined) }}>✓ Cerrada</span>
                      ) : decision === 'pendiente' ? (
                        <span style={{ color: '#EA580C', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); setDecision(key, undefined) }}>Pendiente</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <DecisionButton label="Cerrar" color="#059669" active={false} onClick={() => setDecision(key, 'cerrar')} />
                          <DecisionButton label="Pendiente" color="#EA580C" active={false} onClick={() => setDecision(key, 'pendiente')} />
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedRow === i && <DetailPanel row={r} />}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: colors.gray }}>
            No hay resultados para los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        ...card,
        marginTop: '16px',
        padding: '16px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={handleDownloadExcel}
          disabled={downloading}
          style={{ ...btnSecondary, opacity: downloading ? 0.6 : 1 }}
        >
          {downloading ? 'Descargando...' : 'Descargar informe de reconciliación (Excel)'}
        </button>
        <button
          onClick={closeAllMatches}
          style={btnPrimary}
          onMouseEnter={e => e.target.style.background = '#D4650F'}
          onMouseLeave={e => e.target.style.background = colors.orange}
        >
          Cerrar todas las cuadradas
        </button>
      </div>
    </div>
  )
}
