import { useState, useEffect, useRef } from 'react'

// Agent color assignments — enterprise palette
const AGENT_COLORS = {
  'Orquestador':                '#94A3B8',
  'Agente Ingestor':            '#3B82F6',
  'Agente Detector':            '#14B8A6',
  'Agente Matching':            '#6366F1',
  'Agente Clasificador':        '#8B5CF6',
  'Agente Validador Estructura': '#F59E0B',
  'Agente Validador Datos':     '#F59E0B',
  'Agente QA':                  '#10B981',
}

function getAgentColor(label) {
  return AGENT_COLORS[label] || '#94A3B8'
}

function formatTimestamp(index) {
  const base = new Date()
  base.setSeconds(base.getSeconds() - (20 - index * 2))
  return base.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ── QA Status Badge (header-inline) ──────────────────────────────────

function QAStatusBadge({ qaReport, isActive }) {
  if (isActive) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '6px',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#6366F1',
          animation: 'agentPulse 1.5s ease-in-out infinite',
        }} />
        <span style={{ color: '#A5B4FC', fontSize: '12px', fontWeight: '500' }}>
          Procesando...
        </span>
      </div>
    )
  }

  if (!qaReport) return null

  const pct = qaReport.pct_passed || 0
  const status = qaReport.qa_status || 'unknown'
  const isPass = status === 'pass'
  const isWarn = status === 'warning'

  const color = isPass ? '#10B981' : isWarn ? '#F59E0B' : '#EF4444'
  const bg = isPass ? 'rgba(16,185,129,0.1)' : isWarn ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'
  const border = isPass ? 'rgba(16,185,129,0.25)' : isWarn ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'
  const label = isPass ? 'Confianza alta' : isWarn ? 'Confianza media' : 'Confianza baja'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      borderRadius: '6px',
      background: bg,
      border: `1px solid ${border}`,
      animation: 'fadeSlideIn 0.4s ease',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {isPass ? (
          <path d="M3.5 7L6 9.5L10.5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M7 4.5V7.5M7 9.5H7.005" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        )}
        <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1" opacity="0.4"/>
      </svg>
      <span style={{ color, fontSize: '12px', fontWeight: '600' }}>
        QA {isPass ? '\u2713' : '\u26A0'} {label}
      </span>
      <span style={{ color: '#64748B', fontSize: '11px' }}>
        {pct}%
      </span>
    </div>
  )
}

// ── Entry Row with timeline ──────────────────────────────────────────

function EntryRow({ entry, visible, isLast, index }) {
  const agentColor = getAgentColor(entry.agent_label || entry.agent)
  const hasData = entry.data && typeof entry.data === 'object'

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      display: 'flex',
      gap: '0',
      minHeight: '44px',
    }}>
      {/* Timeline column */}
      <div style={{
        width: '28px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        {index > 0 && (
          <div style={{
            width: '1px',
            height: '8px',
            background: 'rgba(148,163,184,0.2)',
          }} />
        )}
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: agentColor,
          flexShrink: 0,
          marginTop: index === 0 ? '8px' : '0',
        }} />
        {!isLast && (
          <div style={{
            width: '1px',
            flex: 1,
            background: 'rgba(148,163,184,0.2)',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '4px 0 12px 8px',
        minWidth: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ minWidth: 0 }}>
            <span style={{
              color: agentColor,
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: '1',
            }}>
              {entry.agent_label || entry.agent}
            </span>
            <p style={{
              color: '#E2E8F0',
              fontSize: '13px',
              fontWeight: '400',
              marginTop: '3px',
              lineHeight: '1.4',
            }}>
              {entry.detail}
            </p>
          </div>
          <span style={{
            color: '#475569',
            fontSize: '11px',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}>
            {formatTimestamp(index)}
          </span>
        </div>

        {hasData && (
          <div style={{
            marginTop: '6px',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${agentColor}`,
            borderRadius: '0 4px 4px 0',
          }}>
            {Array.isArray(entry.data)
              ? entry.data.map((item, i) => (
                  <div key={i} style={{
                    color: '#94A3B8',
                    fontSize: '12px',
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    padding: '1px 0',
                    lineHeight: '1.5',
                  }}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </div>
                ))
              : Object.entries(entry.data).map(([k, v]) => (
                  <div key={k} style={{
                    color: '#94A3B8',
                    fontSize: '12px',
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    padding: '1px 0',
                    lineHeight: '1.5',
                  }}>
                    <span style={{ color: '#64748B' }}>{k}:</span>{' '}
                    {Array.isArray(v) ? v.join(', ') : String(v)}
                  </div>
                ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

// ── Simulated lines ──────────────────────────────────────────────────

const SIMULATED_REC = [
  { agent_label: 'Orquestador', detail: 'Iniciando proceso de reconciliacion' },
  { agent_label: 'Agente Ingestor', detail: 'Leyendo ficheros de saldos y estadisticas' },
  { agent_label: 'Agente Ingestor', detail: 'Procesando y normalizando datos' },
  { agent_label: 'Agente Detector', detail: 'Analizando estructura de cuentas' },
  { agent_label: 'Agente Matching', detail: 'Cruzando partidas contables vs estadisticas' },
  { agent_label: 'Agente QA', detail: 'Verificando calidad de resultados' },
]

const SIMULATED_DQ = [
  { agent_label: 'Orquestador', detail: 'Iniciando validacion de entregas' },
  { agent_label: 'Agente Ingestor', detail: 'Leyendo ficheros de recibos' },
  { agent_label: 'Agente Ingestor', detail: 'Procesando y normalizando datos' },
  { agent_label: 'Agente Validador Estructura', detail: 'Analizando estructura de ficheros' },
  { agent_label: 'Agente Validador Datos', detail: 'Aplicando reglas de validacion' },
  { agent_label: 'Agente QA', detail: 'Verificando calidad de resultados' },
]

// ── Main Component ───────────────────────────────────────────────────

export default function AgentPanel({ entries, qaReport, loading, variant = 'rec', onAnimationDone }) {
  const [simCount, setSimCount] = useState(0)
  const [realCount, setRealCount] = useState(0)
  const [phase, setPhase] = useState('simulated')
  const bottomRef = useRef(null)
  const simLines = variant === 'dq' ? SIMULATED_DQ : SIMULATED_REC

  // Phase 1: show simulated lines one by one every 1.5s
  useEffect(() => {
    if (phase !== 'simulated') return
    // Show first line immediately
    setSimCount(1)
    let i = 1
    const timer = setInterval(() => {
      i++
      if (i > simLines.length) {
        clearInterval(timer)
        return
      }
      setSimCount(i)
    }, 1500)
    return () => clearInterval(timer)
  }, [phase, simLines.length])

  // Transition: when real entries arrive, clear simulated and start real phase
  useEffect(() => {
    if (entries && entries.length > 0 && phase === 'simulated') {
      setPhase('real')
      setRealCount(0)
    }
  }, [entries, phase])

  // Phase 2: show real entries one by one every 400ms
  useEffect(() => {
    if (phase !== 'real' || !entries) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setRealCount(i)
      if (i >= entries.length) {
        clearInterval(timer)
        setPhase('done')
      }
    }, 400)
    return () => clearInterval(timer)
  }, [phase, entries])

  // Notify parent when all real entries are shown
  useEffect(() => {
    if (phase === 'done' && onAnimationDone) onAnimationDone()
  }, [phase, onAnimationDone])

  // Auto-scroll to bottom as lines appear
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [simCount, realCount])

  const isActive = phase === 'simulated' || phase === 'real'
  const isDone = phase === 'done'

  // Simulated phase: show simulated lines; real/done phase: show real lines
  const displayEntries = phase === 'simulated'
    ? simLines.slice(0, simCount)
    : (entries || []).slice(0, realCount)

  const totalVisible = displayEntries.length
  const isLastKnown = phase === 'simulated'
    ? simCount >= simLines.length
    : isDone

  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: '500',
          }}>Actividad de agentes</span>
          {isDone && entries && (
            <span style={{
              color: '#475569',
              fontSize: '12px',
              fontWeight: '400',
            }}>{entries.length} pasos</span>
          )}
        </div>
        <QAStatusBadge qaReport={isDone ? qaReport : null} isActive={isActive} />
      </div>

      {/* Body */}
      <div style={{
        padding: '20px 24px',
        maxHeight: '520px',
        overflowY: 'auto',
      }}>
        {displayEntries.map((entry, i) => (
          <EntryRow
            key={phase === 'simulated' ? `sim-${i}` : `real-${i}`}
            entry={entry}
            visible={true}
            isLast={i === totalVisible - 1 && isLastKnown}
            index={i}
          />
        ))}
        {/* Ghost next entry for smooth transition */}
        {phase === 'real' && entries && realCount < entries.length && (
          <EntryRow entry={entries[realCount]} visible={false} isLast={false} index={realCount} />
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes agentPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
