import { useState, useEffect, useRef } from 'react'
import { colors, shadows } from '../../theme'

// Map agent names to band colors
const AGENT_COLORS = {
  'Orquestador':                colors.agentOrchestrator,
  'Agente Ingestor':            colors.agentIngestor,
  'Agente Detector':            colors.agentDetector,
  'Agente Matching':            colors.agentMatching,
  'Agente Validador Estructura': colors.agentValidator,
  'Agente Validador Datos':     colors.agentValidator,
  'Agente QA':                  colors.agentQA,
}

function getAgentColor(label) {
  return AGENT_COLORS[label] || colors.agentOrchestrator
}

function QABadge({ qaReport }) {
  if (!qaReport) return null
  const pct = qaReport.pct_passed || 0
  const confidence = qaReport.qa_confidence || '?'
  const status = qaReport.qa_status || 'unknown'

  const isPass = status === 'pass'
  const isWarn = status === 'warning'
  const bg = isPass ? colors.greenBg : isWarn ? colors.yellowBg : colors.redBg
  const color = isPass ? colors.green : isWarn ? colors.yellow : colors.red
  const border = isPass ? colors.greenBorder : isWarn ? colors.yellowBorder : colors.redBorder
  const icon = isPass ? '✓' : '⚠'
  const text = isPass ? `QA ${icon} Confianza Alta — ${pct}%` : `QA ${icon} Confianza ${confidence} — ${pct}%`

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '14px 24px',
      borderRadius: '12px',
      background: bg,
      border: `1px solid ${border}`,
      marginBottom: '16px',
    }}>
      <span style={{ fontSize: '20px' }}>🛡️</span>
      <span style={{
        color,
        fontWeight: '700',
        fontSize: '16px',
        letterSpacing: '0.3px',
      }}>{text}</span>
    </div>
  )
}

function EntryRow({ entry, visible }) {
  const agentColor = getAgentColor(entry.agent_label || entry.agent)
  const hasData = entry.data && typeof entry.data === 'object'

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      padding: '8px 16px',
      marginBottom: '2px',
      borderLeft: `3px solid ${agentColor}`,
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '0 8px 8px 0',
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', flexShrink: 0 }}>
          {entry.icon || '🟢'}
        </span>
        <span style={{
          color: agentColor,
          fontWeight: '600',
          fontSize: '12px',
          flexShrink: 0,
          minWidth: '180px',
          fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
        }}>
          {entry.agent_label || entry.agent}
        </span>
        <span style={{
          color: '#CBD5E1',
          fontSize: '12px',
          fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
        }}>
          {entry.detail}
        </span>
      </div>
      {hasData && (
        <div style={{
          marginLeft: '206px',
          marginTop: '4px',
          padding: '6px 10px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '6px',
        }}>
          {Array.isArray(entry.data)
            ? entry.data.map((item, i) => (
                <div key={i} style={{
                  color: '#64748B',
                  fontSize: '11px',
                  fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
                  padding: '1px 0',
                }}>
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </div>
              ))
            : Object.entries(entry.data).map(([k, v]) => (
                <div key={k} style={{
                  color: '#64748B',
                  fontSize: '11px',
                  fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
                  padding: '1px 0',
                }}>
                  {k}: {Array.isArray(v) ? v.join(', ') : String(v)}
                </div>
              ))
          }
        </div>
      )}
    </div>
  )
}

const SIMULATED_REC = [
  { icon: '🔵', agent_label: 'Orquestador', detail: 'Iniciando proceso de reconciliación...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Leyendo ficheros de saldos y estadísticas...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Procesando y normalizando datos...' },
  { icon: '🟢', agent_label: 'Agente Detector', detail: 'Analizando estructura de cuentas...' },
  { icon: '🟣', agent_label: 'Agente Matching', detail: 'Cruzando partidas contables vs estadísticas...' },
  { icon: '🟡', agent_label: 'Agente QA', detail: 'Verificando calidad de resultados...' },
]

const SIMULATED_DQ = [
  { icon: '🔵', agent_label: 'Orquestador', detail: 'Iniciando validación de entregas...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Leyendo ficheros de recibos...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Procesando y normalizando datos...' },
  { icon: '🟠', agent_label: 'Agente Validador Estructura', detail: 'Analizando estructura de ficheros...' },
  { icon: '🟠', agent_label: 'Agente Validador Datos', detail: 'Aplicando reglas de validación...' },
  { icon: '🟡', agent_label: 'Agente QA', detail: 'Verificando calidad de resultados...' },
]

export default function AgentPanel({ entries, qaReport, loading, variant = 'rec', onAnimationDone }) {
  const [expanded, setExpanded] = useState(true)
  const [simCount, setSimCount] = useState(0)
  const [realCount, setRealCount] = useState(0)
  const [phase, setPhase] = useState('simulated')
  const bottomRef = useRef(null)
  const simLines = variant === 'dq' ? SIMULATED_DQ : SIMULATED_REC

  // Phase 1: animate simulated lines
  useEffect(() => {
    if (phase !== 'simulated') return
    setSimCount(1)
    let i = 1
    const timer = setInterval(() => {
      i++
      if (i > simLines.length) { clearInterval(timer); return }
      setSimCount(i)
    }, 800)
    return () => clearInterval(timer)
  }, [phase, simLines.length])

  // Transition to phase 2
  useEffect(() => {
    if (entries && entries.length > 0 && phase === 'simulated') {
      setPhase('real')
      setRealCount(0)
    }
  }, [entries, phase])

  // Phase 2: animate real entries
  useEffect(() => {
    if (phase !== 'real' || !entries) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setRealCount(i)
      if (i >= entries.length) { clearInterval(timer); setPhase('done') }
    }, 300)
    return () => clearInterval(timer)
  }, [phase, entries])

  // Notify parent
  useEffect(() => {
    if (phase === 'done' && onAnimationDone) onAnimationDone()
  }, [phase, onAnimationDone])

  // Auto-scroll
  useEffect(() => {
    if (bottomRef.current && expanded)
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [simCount, realCount, expanded])

  const isActive = phase === 'simulated' || phase === 'real'
  const isDone = phase === 'done'
  const displayEntries = phase === 'simulated'
    ? simLines.slice(0, simCount)
    : (entries || []).slice(0, realCount)

  return (
    <div>
      {/* QA Badge above panel when done */}
      {isDone && qaReport && <QABadge qaReport={qaReport} />}

      <div style={{
        background: '#0F172A',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Header */}
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            cursor: 'pointer',
            background: '#0B1120',
            borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            <span style={{
              color: '#E2E8F0',
              fontSize: '14px',
              fontWeight: '600',
            }}>Panel de Agentes</span>
            {isActive && (
              <span style={{
                display: 'inline-block',
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: colors.orange,
                animation: 'agentPulse 1.5s ease-in-out infinite',
              }} />
            )}
            {isDone && entries && (
              <span style={{
                color: '#64748B',
                fontSize: '12px',
                padding: '2px 8px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
              }}>{entries.length} pasos completados</span>
            )}
          </div>
          <span style={{
            color: '#64748B',
            fontSize: '14px',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}>▾</span>
        </div>

        {/* Body */}
        {expanded && (
          <div style={{
            padding: '16px 12px',
            maxHeight: '500px',
            overflowY: 'auto',
          }}>
            {displayEntries.map((entry, i) => (
              <EntryRow
                key={phase === 'simulated' ? `sim-${i}` : `real-${i}`}
                entry={entry}
                visible={true}
              />
            ))}
            {phase === 'real' && entries && realCount < entries.length && (
              <EntryRow entry={entries[realCount]} visible={false} />
            )}
            <div ref={bottomRef} />
          </div>
        )}

        <style>{`@keyframes agentPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }`}</style>
      </div>
    </div>
  )
}
