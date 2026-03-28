import React, { useState } from 'react'
import { colors, card } from '../../theme'
import StatusBadge from '../shared/StatusBadge'

function KPI({ label, value, sub }) {
  return (
    <div style={{ ...card, padding: '20px 24px', flex: 1, minWidth: '180px' }}>
      <p style={{ color: colors.gray, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</p>
      <p style={{ color: colors.navy, fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>{value}</p>
      {sub && <p style={{ color: colors.grayLight, fontSize: '12px', marginTop: '4px' }}>{sub}</p>}
    </div>
  )
}

function DetailPanel({ row }) {
  return (
    <tr>
      <td colSpan={8} style={{ padding: '0' }}>
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

export default function RecResults({ data }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [cuentaFilter, setCuentaFilter] = useState('all')
  const [expandedRow, setExpandedRow] = useState(null)

  if (!data) return null

  const rows = (data.reconciliacion || []).filter(r => {
    if (!r) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (cuentaFilter !== 'all' && !r.cuenta?.startsWith(cuentaFilter)) return false
    return true
  })

  const fmt = v => typeof v === 'number' ? v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : '-'
  const pctFmt = v => typeof v === 'number' ? v.toFixed(1) + '%' : '-'

  return (
    <div id="results-section">
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <KPI label="Empresas analizadas" value={data.empresas_analizadas || 0} />
        <KPI label="Partidas totales" value={data.total_partidas || 0} />
        <KPI label="% Cuadrado" value={pctFmt(data.pct_cuadrado)} />
        <KPI label="Diferencia total 705" value={fmt(data.diferencia_total_705)} />
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
              {['Empresa', 'Mes', 'Cuenta', 'Estadística EUR', 'Contabilidad EUR', 'Diferencia EUR', '%', 'Estado'].map(h => (
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
            {rows.map((r, i) => r ? (
              <React.Fragment key={r.id || i}>
                <tr
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                  style={{
                    borderBottom: `1px solid ${colors.borderLight}`,
                    cursor: 'pointer',
                    background: expandedRow === i ? colors.bg : colors.white,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (expandedRow !== i) e.currentTarget.style.background = colors.bg }}
                  onMouseLeave={e => { if (expandedRow !== i) e.currentTarget.style.background = colors.white }}
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
                </tr>
                {expandedRow === i && <DetailPanel row={r} />}
              </React.Fragment>
            ) : null)}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: colors.gray }}>
            No hay resultados para los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  )
}
