import { useState, useMemo, useCallback } from 'react'

const fmt = (n) => {
  if (n == null) return '—'
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'
}
const fmtInt = (n) => (n || 0).toLocaleString('es-ES')

const sevColors = {
  Alta: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
  Media: { bg: '#fffbeb', text: '#d97706', border: '#fcd34d' },
  Baja: { bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
}
const typeColors = {
  'Registro faltante en contabilidad': '#dc2626',
  'Duplicado en contabilidad': '#ea580c',
  'Suplemento no reflejado': '#d97706',
  'Comisión incorrecta': '#7c3aed',
  'Diferencia de timing': '#0e7490',
  'Redondeo': '#64748b',
}
const typeIcons = {
  'Registro faltante en contabilidad': '∅',
  'Duplicado en contabilidad': '⊕',
  'Suplemento no reflejado': 'Δ',
  'Comisión incorrecta': '%',
  'Diferencia de timing': '⏱',
  'Redondeo': '≈',
}
const resLabels = {
  ajustado: { label: 'Ajustado', color: '#16a34a' },
  aceptado: { label: 'Aceptado', color: '#0e7490' },
  investigar: { label: 'En investigación', color: '#b45309' },
}

function Badge({ text, colors }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 600, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
    }}>{text}</span>
  )
}

function Ring({ pct, size = 110 }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct === 100 ? '#16a34a' : pct > 70 ? '#d97706' : '#dc2626'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }} />
    </svg>
  )
}

export default function Dashboard({ data, onReset }) {
  const [items, setItems] = useState(
    () => data.discrepancias.map(d => ({ ...d, estado: 'pendiente', resolucion: null }))
  )
  const [expanded, setExpanded] = useState(null)
  const [filterType, setFilterType] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [view, setView] = useState('cuadre')

  const resolved = items.filter(d => d.estado === 'resuelto')
  const pending = items.filter(d => d.estado === 'pendiente')
  const diffPend = pending.reduce((s, d) => s + Math.abs(d.diferencia || 0), 0)
  const diffRes = resolved.reduce((s, d) => s + Math.abs(d.diferencia || 0), 0)
  const diffAll = items.reduce((s, d) => s + Math.abs(d.diferencia || 0), 0)
  const pctRes = items.length > 0 ? Math.round((resolved.length / items.length) * 100) : 0
  const cuadra = pending.length === 0

  const resolve = useCallback((id, res) => {
    setItems(p => p.map(d => d.id === id ? { ...d, estado: 'resuelto', resolucion: res } : d))
  }, [])
  const unresolve = useCallback((id) => {
    setItems(p => p.map(d => d.id === id ? { ...d, estado: 'pendiente', resolucion: null } : d))
  }, [])

  const filtered = useMemo(() => {
    return items.filter(d => {
      if (filterType !== 'Todos' && d.tipo !== filterType) return false
      if (filterEstado === 'Pendientes' && d.estado !== 'pendiente') return false
      if (filterEstado === 'Resueltos' && d.estado !== 'resuelto') return false
      return true
    })
  }, [items, filterType, filterEstado])

  const tipos = ['Todos', ...new Set(items.map(d => d.tipo))]

  const cs = { // common styles
    page: { minHeight: '100vh', background: '#f1f5f9', padding: '32px 20px' },
    wrap: { maxWidth: '1000px', margin: '0 auto' },
    panel: { background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' },
    lbl: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '6px' },
    sel: { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px', fontSize: '13px' },
  }

  return (
    <div style={cs.page}>
      <div style={cs.wrap}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e94560', fontWeight: 700, marginBottom: '6px' }}>
              Cierre Contable — Análisis Automático
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 300, margin: 0, color: '#1e293b' }}>
              Cuadre <span style={{ fontWeight: 700 }}>Producción vs Contabilidad</span>
            </h1>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Analizado: {data.fecha_analisis} · {fmtInt(data.registros_produccion)} registros procesados
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['cuadre', 'detalle'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                border: `1px solid ${view === v ? '#e94560' : '#e2e8f0'}`,
                background: view === v ? '#e9456015' : '#ffffff',
                color: view === v ? '#e94560' : '#64748b', cursor: 'pointer', textTransform: 'capitalize',
              }}>{v === 'cuadre' ? 'Estado del cuadre' : 'Detalle partidas'}</button>
            ))}
            <button onClick={onReset} style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', cursor: 'pointer',
            }}>Nuevo análisis</button>
          </div>
        </div>

        {/* ═══ CUADRE VIEW ═══ */}
        {view === 'cuadre' && <>
          {/* Status banner */}
          <div style={{
            background: cuadra ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${cuadra ? '#86efac' : '#fca5a5'}`,
            borderRadius: '16px', padding: '28px 32px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Ring pct={pctRes} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: cuadra ? '#16a34a' : '#dc2626' }}>{pctRes}%</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: cuadra ? '#16a34a' : '#dc2626', marginBottom: '4px' }}>
                {cuadra ? 'CUADRE CERRADO' : 'CUADRE PENDIENTE'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                {cuadra
                  ? 'Todas las partidas han sido revisadas y resueltas. El cierre está listo.'
                  : `${pending.length} partida${pending.length !== 1 ? 's' : ''} pendiente${pending.length !== 1 ? 's' : ''} de resolver por un importe de ${fmt(diffPend)}.`}
              </div>
            </div>
          </div>

          {/* Main numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {[
              { l: 'Producción', v: fmt(data.prima_total_produccion), s: `${fmtInt(data.registros_produccion)} registros` },
              { l: 'Contabilidad', v: fmt(data.prima_total_contabilidad), s: `${fmtInt(data.registros_contabilidad)} registros` },
              { l: 'Diferencia bruta', v: fmt(Math.abs(data.diferencia_bruta)), s: `${data.total_discrepancias} partidas`, a: '#d97706' },
            ].map(({ l, v, s, a }) => (
              <div key={l} style={cs.panel}>
                <div style={cs.lbl}>{l}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: a || '#1e293b' }}>{v}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={cs.panel}>
            <div style={cs.lbl}>Progreso de resolución</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#dc2626' }}>{pending.length}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Pendientes</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{fmt(diffPend)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#16a34a' }}>{resolved.length}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Resueltos</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{fmt(diffRes)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>{items.length}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Total</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{fmt(diffAll)}</div>
              </div>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: '20px' }}>
              <div style={{ height: '100%', width: `${pctRes}%`, background: 'linear-gradient(90deg, #16a34a, #22d3ee)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Type breakdown */}
          <div style={cs.panel}>
            <div style={cs.lbl}>Partidas por tipo</div>
            {[...new Set(items.map(d => d.tipo))].map(tipo => {
              const all = items.filter(d => d.tipo === tipo)
              const res = all.filter(d => d.estado === 'resuelto').length
              const pend = all.length - res
              const c = typeColors[tipo] || '#64748b'
              return (
                <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '15px', color: c, fontWeight: 700, width: '24px', textAlign: 'center' }}>{typeIcons[tipo] || '?'}</span>
                  <span style={{ fontSize: '13px', color: '#374151', flex: 1 }}>{tipo}</span>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>{res} resuelto{res !== 1 ? 's' : ''}</span>
                  <span style={{ fontSize: '12px', color: pend > 0 ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>{pend} pend.</span>
                </div>
              )
            })}
          </div>

          <button onClick={() => setView('detalle')} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e94560',
            background: '#e9456015', color: '#e94560', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
          }}>
            Ir al detalle para resolver partidas →
          </button>
        </>}

        {/* ═══ DETAIL VIEW ═══ */}
        {view === 'detalle' && <>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              { l: 'Pendientes', v: pending.length, c: '#dc2626' },
              { l: 'Resueltos', v: resolved.length, c: '#16a34a' },
              { l: 'Importe pendiente', v: fmt(diffPend), c: '#d97706', isStr: true },
            ].map(({ l, v, c, isStr }) => (
              <div key={l} style={{ ...cs.panel, flex: '1 1 0', marginBottom: 0 }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>{l}</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: c }}>{isStr ? v : fmtInt(v)}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={cs.sel}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} style={cs.sel}>
              {['Todos', 'Pendientes', 'Resueltos'].map(e => <option key={e}>{e}</option>)}
            </select>
            <div style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>{filtered.length} partida{filtered.length !== 1 ? 's' : ''}</div>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.map(d => {
              const isOpen = expanded === d.id
              const tc = typeColors[d.tipo] || '#64748b'
              const sc = sevColors[d.severidad] || sevColors.Baja
              const isRes = d.estado === 'resuelto'

              return (
                <div key={d.id} onClick={() => setExpanded(isOpen ? null : d.id)} style={{
                  background: isRes ? '#f0fdf4' : (isOpen ? '#f8fafc' : '#ffffff'),
                  border: `1px solid ${isRes ? '#86efac' : (isOpen ? tc + '44' : '#e2e8f0')}`,
                  borderRadius: '10px', padding: '14px 18px', cursor: 'pointer',
                  opacity: isRes && !isOpen ? 0.7 : 1, transition: 'all 0.2s ease',
                }}>
                  {/* Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {isRes && <span style={{ color: resLabels[d.resolucion]?.color || '#16a34a' }}>✓</span>}
                    <span style={{ fontSize: '14px', color: tc, fontWeight: 700, width: '20px', textAlign: 'center' }}>{typeIcons[d.tipo] || '?'}</span>
                    <Badge text={d.severidad} colors={sc} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{d.poliza}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{d.aseguradora} · {d.ramo}</span>
                    {isRes && d.resolucion && (
                      <span style={{ fontSize: '11px', color: resLabels[d.resolucion]?.color, fontWeight: 600 }}>
                        [{resLabels[d.resolucion]?.label}]
                      </span>
                    )}
                    {d.diferencia !== 0 && d.diferencia != null && (
                      <span style={{ fontSize: '13px', fontWeight: 700, color: d.diferencia > 0 ? '#16a34a' : '#dc2626', marginLeft: 'auto' }}>
                        {d.diferencia > 0 ? '+' : ''}{fmt(d.diferencia)}
                      </span>
                    )}
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${tc}22` }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                        {[
                          { l: 'Cliente', v: d.cliente },
                          { l: 'Recibo', v: d.recibo },
                          { l: 'Producción', v: fmt(d.importe_produccion), bold: true },
                          { l: 'Contabilidad', v: fmt(d.importe_contabilidad), bold: true },
                        ].map(({ l, v, bold }) => (
                          <div key={l}>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '3px' }}>{l}</div>
                            <div style={{ fontSize: bold ? '14px' : '13px', fontWeight: bold ? 600 : 400, color: '#374151' }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: tc, marginBottom: '4px', fontWeight: 700 }}>Análisis</div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{d.explicacion}</div>
                      </div>
                      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#16a34a', marginBottom: '4px', fontWeight: 700 }}>Acción recomendada</div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{d.accion_recomendada}</div>
                      </div>

                      {!isRes ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {[
                            { k: 'ajustado', label: 'Marcar como Ajustado', bc: '#86efac', bg: '#f0fdf4', c: '#16a34a' },
                            { k: 'aceptado', label: 'Aceptar diferencia', bc: '#a5f3fc', bg: '#ecfeff', c: '#0e7490' },
                            { k: 'investigar', label: 'En investigación', bc: '#fcd34d', bg: '#fffbeb', c: '#b45309' },
                          ].map(({ k, label, bc, bg, c }) => (
                            <button key={k} onClick={() => resolve(d.id, k)} style={{
                              padding: '8px 16px', borderRadius: '8px', border: `1px solid ${bc}`,
                              background: bg, color: c, cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                            }}>{label}</button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '13px', color: resLabels[d.resolucion]?.color, fontWeight: 600 }}>✓ {resLabels[d.resolucion]?.label}</span>
                          <button onClick={() => unresolve(d.id)} style={{
                            padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0',
                            background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '11px',
                          }}>Deshacer</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>}

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Motor de Reconciliación Contable · Demo
        </div>
      </div>
    </div>
  )
}
