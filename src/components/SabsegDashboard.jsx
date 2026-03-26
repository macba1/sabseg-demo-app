import { useState, useMemo } from 'react'
import Logo from './Logo'

const ORANGE = '#E8721A'

const fmt = (n) => {
  if (n == null) return '—'
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

const statusColors = {
  match:   { bg: '#f0fdf4', text: '#16A34A', border: '#86efac', label: 'Cuadrado', dot: '#16A34A' },
  warning: { bg: '#fffbeb', text: '#F59E0B', border: '#fcd34d', label: 'Warning',  dot: '#F59E0B' },
  mismatch:{ bg: '#fef2f2', text: '#DC2626', border: '#fca5a5', label: 'Discrepancia', dot: '#DC2626' },
}

const cs = {
  page: { minHeight: '100vh', background: '#FFFFFF', padding: '32px 20px' },
  wrap: { maxWidth: '1100px', margin: '0 auto' },
  panel: { background: '#F8F9FA', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px' },
  lbl: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '6px' },
}

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.match
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.dot }} />
      {c.label}
    </span>
  )
}

function Ring({ pct, size = 100 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 80 ? '#16A34A' : pct >= 50 ? '#F59E0B' : '#DC2626'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

function DetailPanel({ item }) {
  return (
    <div style={{ padding: '16px 20px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '3px' }}>Estadística</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1B2A4A' }}>{fmt(item.estadistica)}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '3px' }}>Contabilidad</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1B2A4A' }}>{fmt(item.contabilidad)}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '3px' }}>Diferencia</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: item.diferencia === 0 ? '#16A34A' : item.diferencia > 0 ? '#F59E0B' : '#DC2626' }}>
            {item.diferencia > 0 ? '+' : ''}{fmt(item.diferencia)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Recibos analizados: <strong style={{ color: '#1B2A4A' }}>{item.recibos_analizados}</strong>
        </span>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Desviación: <strong style={{ color: statusColors[item.status]?.text }}>{item.pct > 0 ? '+' : ''}{item.pct}%</strong>
        </span>
      </div>

      {/* Detalle subcuentas contables */}
      {item.detalle_contab && Object.keys(item.detalle_contab).length > 0 && (
        <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: ORANGE, marginBottom: '6px', fontWeight: 700 }}>Subcuentas contables</div>
          {Object.entries(item.detalle_contab).map(([cuenta, valor]) => (
            <div key={cuenta} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '12px' }}>
              <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{cuenta}</span>
              <span style={{ color: '#1B2A4A', fontWeight: 600 }}>{fmt(Math.abs(valor))}</span>
            </div>
          ))}
        </div>
      )}

      {/* Explicacion */}
      <div style={{ background: '#F8F9FA', borderRadius: '8px', padding: '12px 14px', border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: statusColors[item.status]?.text, marginBottom: '4px', fontWeight: 700 }}>Explicacion</div>
        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{item.explicacion}</div>
      </div>
    </div>
  )
}

export default function SabsegDashboard({ data, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [filterCuenta, setFilterCuenta] = useState('Todas')

  const items = data.reconciliacion || []

  const filtered = useMemo(() => {
    return items.filter(d => {
      if (filterStatus !== 'Todos' && d.status !== filterStatus) return false
      if (filterCuenta !== 'Todas' && d.cuenta !== filterCuenta) return false
      return true
    })
  }, [items, filterStatus, filterCuenta])

  const matches = items.filter(r => r.status === 'match').length
  const warnings = items.filter(r => r.status === 'warning').length
  const mismatches = items.filter(r => r.status === 'mismatch').length

  return (
    <div style={cs.page}>
      <div style={cs.wrap}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: ORANGE, fontWeight: 700, marginBottom: '6px' }}>
              Reconciliacion Real — Datos Sabseg
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 300, margin: 0, color: '#1B2A4A' }}>
              Cuadre <span style={{ fontWeight: 700 }}>Estadistica vs Contabilidad</span>
            </h1>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              {data.fecha_analisis} · Periodo: {data.periodo} · {data.empresas_analizadas} empresas analizadas
            </div>
          </div>
          <button onClick={onBack} style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            border: '1px solid #E2E8F0', background: 'transparent', color: '#64748b', cursor: 'pointer',
          }}>← Volver</button>
        </div>

        {/* Summary ring + cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ ...cs.panel, display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 300px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Ring pct={data.pct_cuadrado} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: data.pct_cuadrado >= 80 ? '#16A34A' : '#DC2626' }}>{data.pct_cuadrado}%</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1B2A4A', marginBottom: '8px' }}>Estado del cuadre</div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px' }}><span style={{ color: '#16A34A', fontWeight: 700 }}>{matches}</span> <span style={{ color: '#64748b' }}>cuadrados</span></span>
                <span style={{ fontSize: '13px' }}><span style={{ color: '#F59E0B', fontWeight: 700 }}>{warnings}</span> <span style={{ color: '#64748b' }}>warnings</span></span>
                <span style={{ fontSize: '13px' }}><span style={{ color: '#DC2626', fontWeight: 700 }}>{mismatches}</span> <span style={{ color: '#64748b' }}>discrepancias</span></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: '1 1 300px' }}>
            {[
              { l: 'Total Estadistica (705)', v: fmt(data.total_estadistica_705), c: '#1B2A4A' },
              { l: 'Total Contabilidad (705)', v: fmt(data.total_contabilidad_705), c: '#1B2A4A' },
              { l: 'Diferencia total (705)', v: fmt(data.diferencia_total_705), c: data.diferencia_total_705 > 1000 ? '#DC2626' : '#F59E0B' },
              { l: 'Total partidas', v: data.total_partidas, c: '#1B2A4A' },
            ].map(c => (
              <div key={c.l} style={{ ...cs.panel, marginBottom: 0, padding: '14px 16px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '4px' }}>{c.l}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: c.c }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Files processed info */}
        {data.ficheros_procesados && data.ficheros_procesados.length > 0 && (
          <div style={{ ...cs.panel, padding: '16px 20px' }}>
            <div style={cs.lbl}>Ficheros procesados ({data.ficheros_procesados.length})</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {data.ficheros_procesados.map((f, i) => (
                <span key={i} style={{
                  fontSize: '11px', padding: '3px 10px', borderRadius: '6px',
                  background: '#F8F9FA', border: '1px solid #E2E8F0', color: '#64748b',
                }}>
                  {f.filename} <strong style={{ color: '#1B2A4A' }}>({f.records_extracted} rec.)</strong>
                </span>
              ))}
            </div>
            {data.ficheros_error && data.ficheros_error.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {data.ficheros_error.map((f, i) => (
                  <span key={i} style={{ fontSize: '11px', color: '#DC2626' }}>
                    {f.filename}: {f.error}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
            background: '#F8F9FA', color: '#1B2A4A', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '7px 12px', fontSize: '13px',
          }}>
            <option value="Todos">Todos los estados</option>
            <option value="match">Cuadrados</option>
            <option value="warning">Warnings</option>
            <option value="mismatch">Discrepancias</option>
          </select>
          <select value={filterCuenta} onChange={e => setFilterCuenta(e.target.value)} style={{
            background: '#F8F9FA', color: '#1B2A4A', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '7px 12px', fontSize: '13px',
          }}>
            <option value="Todas">Todas las cuentas</option>
            <option value="705">705 — Comisiones</option>
            <option value="623">623 — Comisiones cedidas</option>
          </select>
          <div style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>{filtered.length} partida{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Reconciliation table */}
        <div style={{ background: '#F8F9FA', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 80px 120px 110px 110px 100px 60px 110px',
            padding: '10px 20px',
            borderBottom: '2px solid #E2E8F0',
            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b',
          }}>
            <div>Empresa</div>
            <div>Mes</div>
            <div>Cuenta</div>
            <div style={{ textAlign: 'right' }}>Estadistica</div>
            <div style={{ textAlign: 'right' }}>Contabilidad</div>
            <div style={{ textAlign: 'right' }}>Diferencia</div>
            <div style={{ textAlign: 'right' }}>%</div>
            <div style={{ textAlign: 'center' }}>Status</div>
          </div>

          {/* Rows */}
          {filtered.map(item => {
            const isOpen = expanded === item.id
            const sc = statusColors[item.status] || statusColors.match

            return (
              <div key={item.id}>
                <div
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 80px 120px 110px 110px 100px 60px 110px',
                    padding: '12px 20px',
                    borderBottom: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    background: isOpen ? '#FFFFFF' : 'transparent',
                    fontSize: '13px', color: '#1B2A4A',
                    transition: 'background 0.15s ease',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#FFFFFF' }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                    {item.empresa}
                  </div>
                  <div style={{ color: '#64748b' }}>{item.mes_label}</div>
                  <div>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                      background: item.cuenta === '705' ? '#eff6ff' : '#faf5ff',
                      color: item.cuenta === '705' ? '#2563eb' : '#7c3aed',
                      border: `1px solid ${item.cuenta === '705' ? '#bfdbfe' : '#e9d5ff'}`,
                    }}>
                      {item.cuenta_label}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '12px' }}>{fmt(item.estadistica)}</div>
                  <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '12px' }}>{fmt(item.contabilidad)}</div>
                  <div style={{
                    textAlign: 'right', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
                    color: Math.abs(item.diferencia) < 10 ? '#16A34A' : sc.text,
                  }}>
                    {item.diferencia > 0 ? '+' : ''}{fmt(item.diferencia)}
                  </div>
                  <div style={{
                    textAlign: 'right', fontSize: '12px', fontWeight: 600,
                    color: Math.abs(item.pct) < 1 ? '#16A34A' : sc.text,
                  }}>
                    {item.pct > 0 ? '+' : ''}{item.pct}%
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {isOpen && <DetailPanel item={item} />}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              No hay partidas con los filtros seleccionados
            </div>
          )}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Motor de Reconciliacion Real · Sabseg
        </div>
      </div>
    </div>
  )
}
