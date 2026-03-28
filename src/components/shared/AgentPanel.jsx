import { useState, useEffect, useRef, useId } from 'react'

// ── Agent display names & colors ─────────────────────────────────────

const AGENT_MAP = {
  'Orquestador':                { name: 'Coordinador de procesos',    color: '#94A3B8' },
  'Agente Ingestor':            { name: 'Analista de datos',          color: '#3B82F6' },
  'Agente Detector':            { name: 'Especialista en esquemas',   color: '#14B8A6' },
  'Agente Matching':            { name: 'Analista de conciliación',   color: '#6366F1' },
  'Agente Clasificador':        { name: 'Analista de discrepancias',  color: '#8B5CF6' },
  'Agente Validador Estructura':{ name: 'Inspector de calidad',       color: '#F59E0B' },
  'Agente Validador Datos':     { name: 'Inspector de calidad',       color: '#F59E0B' },
  'Agente QA':                  { name: 'Auditor de resultados',      color: '#10B981' },
  'Agente Corrector':           { name: 'Especialista en correcciones', color: '#EC4899' },
}

function getAgent(label) {
  return AGENT_MAP[label] || { name: label, color: '#94A3B8' }
}

// ── Flatten entries: main line + data sub-lines ──────────────────────

function flattenEntries(entries, baseTime) {
  const lines = []
  let elapsed = 0
  entries.forEach((entry) => {
    const agent = getAgent(entry.agent_label || entry.agent)
    elapsed += 0.12 + Math.random() * 0.25
    lines.push({
      type: 'main',
      time: elapsed.toFixed(2) + 's',
      agentName: agent.name,
      agentColor: agent.color,
      detail: entry.detail || '',
    })
    // Flatten data into sub-lines
    if (entry.data && typeof entry.data === 'object') {
      const items = Array.isArray(entry.data)
        ? entry.data
        : Object.entries(entry.data).map(([k, v]) =>
            `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`
          )
      items.forEach((item) => {
        elapsed += 0.03 + Math.random() * 0.06
        lines.push({
          type: 'data',
          time: elapsed.toFixed(2) + 's',
          agentColor: agent.color,
          text: typeof item === 'string' ? item : JSON.stringify(item),
        })
      })
    }
  })
  return lines
}

// ── Simulated lines (shown while API is in flight) ───────────────────

const SIMULATED_REC = [
  { agent_label: 'Orquestador', detail: 'Iniciando pipeline de reconciliacion contable' },
  { agent_label: 'Agente Ingestor', detail: 'Cargando ficheros de saldos y estadisticas' },
  { agent_label: 'Agente Ingestor', detail: 'Normalizando estructuras de datos' },
  { agent_label: 'Agente Detector', detail: 'Detectando esquema de cuentas contables' },
  { agent_label: 'Agente Matching', detail: 'Cruzando partidas contables vs estadisticas de venta' },
  { agent_label: 'Agente QA', detail: 'Ejecutando validaciones de calidad' },
]

const SIMULATED_DQ = [
  { agent_label: 'Orquestador', detail: 'Iniciando pipeline de validacion de entregas' },
  { agent_label: 'Agente Ingestor', detail: 'Cargando ficheros de recibos de corredurias' },
  { agent_label: 'Agente Ingestor', detail: 'Normalizando estructuras de datos' },
  { agent_label: 'Agente Validador Estructura', detail: 'Validando estructura de ficheros' },
  { agent_label: 'Agente Validador Datos', detail: 'Aplicando reglas de validacion de datos' },
  { agent_label: 'Agente QA', detail: 'Ejecutando validaciones de calidad' },
]

// ── Main Component ───────────────────────────────────────────────────

export default function AgentPanel({ entries, qaReport, loading, variant = 'rec', onAnimationDone }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [phase, setPhase] = useState('simulated') // 'simulated' | 'streaming' | 'done'
  const [streamIndex, setStreamIndex] = useState(0)
  const scrollRef = useRef(null)
  const flatRef = useRef([])
  const uid = useId()

  const simLines = variant === 'dq' ? SIMULATED_DQ : SIMULATED_REC

  // Phase 1: simulated lines while waiting for API (1.5s apart)
  useEffect(() => {
    if (phase !== 'simulated') return

    const simFlat = flattenEntries(simLines, 0)
    let i = 0
    // Show first line immediately
    setVisibleLines([simFlat[0]])
    i = 1

    const timer = setInterval(() => {
      if (i >= simFlat.length) {
        clearInterval(timer)
        return
      }
      setVisibleLines(prev => [...prev, simFlat[i]])
      i++
    }, 1500)

    return () => clearInterval(timer)
  }, [phase, simLines])

  // Transition: when real entries arrive, switch to streaming
  useEffect(() => {
    if (entries && entries.length > 0 && phase === 'simulated') {
      const flat = flattenEntries(entries, 0)
      flatRef.current = flat
      setPhase('streaming')
      setStreamIndex(0)
      setVisibleLines([]) // clear simulated
    }
  }, [entries, phase])

  // Phase 2: stream real lines fast (100-150ms each)
  useEffect(() => {
    if (phase !== 'streaming') return
    const flat = flatRef.current
    if (flat.length === 0) {
      setPhase('done')
      return
    }

    let i = 0
    const timer = setInterval(() => {
      if (i >= flat.length) {
        clearInterval(timer)
        setPhase('done')
        return
      }
      setVisibleLines(prev => [...prev, flat[i]])
      setStreamIndex(i)
      i++
    }, 120)

    return () => clearInterval(timer)
  }, [phase])

  // Notify parent when done
  useEffect(() => {
    if (phase === 'done' && onAnimationDone) onAnimationDone()
  }, [phase, onAnimationDone])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleLines])

  const isActive = phase === 'simulated' || phase === 'streaming'
  const isDone = phase === 'done'

  // QA completion line
  const qaLine = (() => {
    if (!isDone || !qaReport) return null
    const pct = qaReport.pct_passed || 0
    const status = qaReport.qa_status || 'unknown'
    if (status === 'pass') return { text: `\u2713 Proceso completado — Confianza alta (${pct}%)`, color: '#10B981' }
    if (status === 'warning') return { text: `\u26A0 Proceso completado — Confianza media (${pct}%)`, color: '#F59E0B' }
    return { text: `\u2716 Proceso completado — Confianza baja (${pct}%)`, color: '#EF4444' }
  })()

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
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{
          color: '#F1F5F9',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>Actividad del sistema</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDone && entries && (
            <span style={{ color: '#475569', fontSize: '11px', fontFamily: 'monospace' }}>
              {entries.length} ops
            </span>
          )}
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isActive ? '#10B981' : '#475569',
            animation: isActive ? 'agentPulse 1s ease-in-out infinite' : 'none',
          }} />
        </div>
      </div>

      {/* Stream body */}
      <div
        ref={scrollRef}
        className={`agent-stream-${uid.replace(/:/g, '')}`}
        style={{
          height: '350px',
          overflowY: 'auto',
          padding: '12px 16px',
          fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
          fontSize: '12px',
          lineHeight: '1.7',
        }}
      >
        {visibleLines.map((line, i) => {
          if (line.type === 'main') {
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                opacity: 0,
                animation: 'lineIn 0.15s ease forwards',
              }}>
                <span style={{ color: '#334155', fontSize: '11px', minWidth: '42px', textAlign: 'right' }}>
                  {line.time}
                </span>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: line.agentColor, flexShrink: 0,
                }} />
                <span style={{ color: line.agentColor, fontWeight: '600', fontSize: '12px' }}>
                  {line.agentName}
                </span>
                <span style={{ color: '#475569' }}>{'\u2192'}</span>
                <span style={{
                  color: '#CBD5E1',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {line.detail}
                </span>
              </div>
            )
          }
          // data sub-line
          return (
            <div key={i} style={{
              display: 'flex',
              gap: '8px',
              paddingLeft: '58px',
              opacity: 0,
              animation: 'lineIn 0.15s ease forwards',
            }}>
              <span style={{ color: '#334155', fontSize: '11px', minWidth: '42px', textAlign: 'right' }}>
                {line.time}
              </span>
              <span style={{
                color: '#64748B',
                fontSize: '11px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {line.text}
              </span>
            </div>
          )
        })}

        {/* QA completion line */}
        {qaLine && (
          <div style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0,
            animation: 'lineIn 0.3s ease 0.2s forwards',
          }}>
            <span style={{
              color: qaLine.color,
              fontSize: '13px',
              fontWeight: '600',
            }}>
              {qaLine.text}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes agentPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes lineIn { from { opacity: 0 } to { opacity: 1 } }
        .agent-stream-${uid.replace(/:/g, '')}::-webkit-scrollbar { width: 4px; }
        .agent-stream-${uid.replace(/:/g, '')}::-webkit-scrollbar-track { background: transparent; }
        .agent-stream-${uid.replace(/:/g, '')}::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 2px; }
        .agent-stream-${uid.replace(/:/g, '')}::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  )
}
