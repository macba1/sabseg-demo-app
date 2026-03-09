import { useState } from 'react'
import Logo from './Logo'

const ORANGE = '#E8721A'

const confColors = {
  high:   { bg: '#f0fdf4', text: '#16A34A', border: '#86efac', label: 'Alta' },
  medium: { bg: '#fffbeb', text: '#F59E0B', border: '#fcd34d', label: 'Media' },
  low:    { bg: '#fef2f2', text: '#DC2626', border: '#fca5a5', label: 'Baja' },
  none:   { bg: '#F8F9FA', text: '#94a3b8', border: '#E2E8F0', label: '—' },
}

const sevColors = {
  Alta:  '#DC2626',
  Media: '#F59E0B',
  Baja:  '#16A34A',
}

const countryFlags = { ES: 'ES', PT: 'PT', IT: 'IT', '??': '??' }

const cs = {
  page: { minHeight: '100vh', background: '#FFFFFF', padding: '32px 20px' },
  wrap: { maxWidth: '1000px', margin: '0 auto' },
  panel: { background: '#F8F9FA', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px' },
  lbl: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', marginBottom: '6px' },
}

function ConfBadge({ level }) {
  const c = confColors[level] || confColors.none
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
      fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>{c.label}</span>
  )
}

function FileSection({ result, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const [tab, setTab] = useState('mapping')

  const mc = result.mapping_confidence || {}
  const country = result.detected_country || '??'
  const lang = result.detected_language || '?'

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
        <span style={{
          fontSize: '14px', fontWeight: 700, color: '#fff', background: ORANGE,
          borderRadius: '6px', padding: '4px 10px', flexShrink: 0,
        }}>
          {countryFlags[country] || country}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B2A4A' }}>
            {result.label || result.filename}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {lang} · {result.total_records} registros · {result.columns_mapped}/{result.total_columns} columnas mapeadas
          </div>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: result.pct_clean >= 90 ? '#16A34A' : result.pct_clean >= 70 ? '#F59E0B' : '#DC2626' }}>
          {result.pct_clean}% limpio
        </div>
        <span style={{ color: '#94a3b8', fontSize: '16px', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </div>

      {open && (
        <div style={{ padding: '20px 24px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {[
              { k: 'mapping', l: 'Mapping de campos' },
              { k: 'quality', l: 'Calidad de datos' },
              { k: 'preview', l: 'Preview normalizado' },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                border: `1px solid ${tab === t.k ? ORANGE : '#E2E8F0'}`,
                background: tab === t.k ? '#E8721A12' : '#FFFFFF',
                color: tab === t.k ? ORANGE : '#64748b', cursor: 'pointer',
              }}>{t.l}</button>
            ))}
          </div>

          {/* Mapping tab */}
          {tab === 'mapping' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[
                  { l: 'Alta', v: mc.high || 0, c: '#16A34A' },
                  { l: 'Media', v: mc.medium || 0, c: '#F59E0B' },
                  { l: 'Baja', v: mc.low || 0, c: '#DC2626' },
                  { l: 'Sin mapeo', v: mc.unmapped || 0, c: '#94a3b8' },
                ].map(b => (
                  <span key={b.l} style={{ fontSize: '12px', color: b.c, fontWeight: 600 }}>
                    {b.v} {b.l}
                  </span>
                ))}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                      <th style={th}>Columna original</th>
                      <th style={th}>Campo canónico</th>
                      <th style={th}>Confianza</th>
                      <th style={th}>Ejemplo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.mapping.map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={td}><code style={{ fontSize: '12px', color: '#1B2A4A' }}>{m.columna_original}</code></td>
                        <td style={td}>{m.label_canonico !== 'No mapeado' ? m.label_canonico : <span style={{ color: '#94a3b8' }}>—</span>}</td>
                        <td style={td}><ConfBadge level={m.confianza} /></td>
                        <td style={{ ...td, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>{m.ejemplo_valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quality tab */}
          {tab === 'quality' && (
            <div>
              {result.quality_issues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#16A34A', fontWeight: 600 }}>
                  Sin problemas de calidad detectados
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.quality_issues.map((q, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                      background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0',
                    }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                        background: sevColors[q.severidad] || '#94a3b8',
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                          {q.tipo} — {q.campo}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{q.detalle}</div>
                      </div>
                      <span style={{
                        fontSize: '13px', fontWeight: 700,
                        color: sevColors[q.severidad] || '#94a3b8',
                      }}>{q.cantidad}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview tab */}
          {tab === 'preview' && (
            <div style={{ overflowX: 'auto' }}>
              {result.normalized_preview && result.normalized_preview.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                      {result.canonical_columns.map(c => (
                        <th key={c} style={{ ...th, fontSize: '10px', whiteSpace: 'nowrap' }}>
                          {(CANONICAL_LABELS[c]) || c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.normalized_preview.slice(0, 5).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {result.canonical_columns.map(c => (
                          <td key={c} style={{ ...td, fontSize: '11px', whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#374151' }}>
                            {row[c] != null ? String(row[c]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Sin datos normalizados</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const th = { textAlign: 'left', padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }
const td = { padding: '8px 10px', color: '#1B2A4A' }

const CANONICAL_LABELS = {
  policy_id: 'ID Póliza', customer_name: 'Cliente', tax_id: 'ID Fiscal', insurer: 'Aseguradora',
  product_line: 'Ramo', premium_net: 'Prima Neta', taxes: 'Impuestos', premium_gross: 'Prima Total',
  commission_pct: '% Comisión', commission_amount: 'Comisión €', payment_frequency: 'Forma Pago',
  inception_date: 'F. Efecto', expiry_date: 'F. Vencimiento', status: 'Estado', sector: 'Sector',
  region: 'Región', sales_agent: 'Comercial', notes: 'Observaciones',
}

export default function NormalizeDashboard({ data, onBack }) {
  const results = data.results || [data]
  const isMulti = Array.isArray(data.results)

  return (
    <div style={cs.page}>
      <div style={cs.wrap}>
        <Logo />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: ORANGE, fontWeight: 700, marginBottom: '6px' }}>
              Homogeneización — Resultados
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 300, margin: 0, color: '#1B2A4A' }}>
              Normalización <span style={{ fontWeight: 700 }}>de Datos de Corredurías</span>
            </h1>
          </div>
          <button onClick={onBack} style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            border: '1px solid #E2E8F0', background: 'transparent', color: '#64748b', cursor: 'pointer',
          }}>← Volver a la Landing</button>
        </div>

        {/* Summary cards */}
        {isMulti && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {[
              { l: 'Ficheros', v: data.total_files, c: '#1B2A4A' },
              { l: 'Registros totales', v: (data.total_records || 0).toLocaleString('es-ES'), c: '#1B2A4A' },
              { l: 'Países detectados', v: (data.countries_detected || []).join(', '), c: ORANGE },
              { l: 'Incidencias calidad', v: data.total_quality_issues || 0, c: (data.total_quality_issues || 0) > 0 ? '#DC2626' : '#16A34A' },
            ].map(c => (
              <div key={c.l} style={cs.panel}>
                <div style={cs.lbl}>{c.l}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: c.c }}>{c.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Per-file sections */}
        {results.map((r, i) => (
          <FileSection key={i} result={r} defaultOpen={i === 0} />
        ))}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Motor de Homogeneización · Sabseg Demo
        </div>
      </div>
    </div>
  )
}
