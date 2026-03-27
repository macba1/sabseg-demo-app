import { useState, useEffect, useRef, useCallback } from 'react'
import { colors, shadows } from '../../theme'

function ConfidenceBadge({ qaReport }) {
  if (!qaReport) return null
  const pct = qaReport.pct_passed || 0
  const confidence = qaReport.qa_confidence || '?'
  const status = qaReport.qa_status || 'unknown'

  const badgeColor = status === 'pass' ? colors.green
    : status === 'warning' ? colors.yellow : colors.red
  const badgeBg = status === 'pass' ? colors.greenBg
    : status === 'warning' ? colors.yellowBg : colors.redBg

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 14px', borderRadius: '8px',
      background: badgeBg, border: `1px solid ${badgeColor}30`,
      marginTop: '12px',
    }}>
      <span style={{ fontSize: '14px' }}>🛡️</span>
      <span style={{ color: badgeColor, fontWeight: '700', fontSize: '13px' }}>
        QA: {confidence} ({pct}%)
      </span>
    </div>
  )
}

function EntryRow({ entry, visible }) {
  const hasData = entry.data && typeof entry.data === 'object'

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      padding: '4px 0',
      lineHeight: '1.6',
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '13px', flexShrink: 0, width: '20px', textAlign: 'center' }}>
          {entry.icon || '🟢'}
        </span>
        <span style={{ color: '#E8721A', fontWeight: '600', fontSize: '12px', flexShrink: 0, minWidth: '160px' }}>
          {entry.agent_label || entry.agent}
        </span>
        <span style={{ color: '#E2E8F0', fontSize: '12px' }}>
          {entry.detail}
        </span>
      </div>
      {hasData && (
        <div style={{ marginLeft: '188px', paddingTop: '2px' }}>
          {Array.isArray(entry.data)
            ? entry.data.map((item, i) => (
                <div key={i} style={{ color: '#94A3B8', fontSize: '11px', fontFamily: 'monospace' }}>
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </div>
              ))
            : Object.entries(entry.data).map(([k, v]) => (
                <div key={k} style={{ color: '#94A3B8', fontSize: '11px', fontFamily: 'monospace' }}>
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
  { icon: '🔵', agent_label: 'Orquestador', detail: 'Iniciando proceso...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Leyendo ficheros...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Procesando datos...' },
  { icon: '🟢', agent_label: 'Agente Detector', detail: 'Analizando estructura...' },
  { icon: '🟢', agent_label: 'Agente Matching', detail: 'Cruzando datos...' },
  { icon: '🟡', agent_label: 'Agente QA', detail: 'Verificando calidad...' },
]

const SIMULATED_DQ = [
  { icon: '🔵', agent_label: 'Orquestador', detail: 'Iniciando proceso...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Leyendo ficheros...' },
  { icon: '🟢', agent_label: 'Agente Ingestor', detail: 'Procesando datos...' },
  { icon: '🟢', agent_label: 'Agente Validador Estructura', detail: 'Analizando estructura...' },
  { icon: '🟢', agent_label: 'Agente Validador Datos', detail: 'Aplicando reglas de validación...' },
  { icon: '🟡', agent_label: 'Agente QA', detail: 'Verificando calidad...' },
]

/**
 * AgentPanel — two-phase display:
 *
 * Phase 1 (loading=true, entries=null): show simulated lines every 800ms
 * Phase 2 (entries provided): replace simulated with real, animate at 300ms
 *
 * Props:
 *  - entries: real agent_log array (null while loading)
 *  - qaReport: QA report object
 *  - loading: whether API call is in progress
 *  - variant: 'rec' | 'dq' (picks simulated lines)
 *  - onAnimationDone: callback when all real entries have been shown
 */
export default function AgentPanel({ entries, qaReport, loading, variant = 'rec', onAnimationDone }) {
  const [expanded, setExpanded] = useState(true)
  const [simCount, setSimCount] = useState(0)
  const [realCount, setRealCount] = useState(0)
  const [phase, setPhase] = useState('simulated') // 'simulated' | 'real' | 'done'
  const bottomRef = useRef(null)
  const simLines = variant === 'dq' ? SIMULATED_DQ : SIMULATED_REC

  // Phase 1: animate simulated lines
  useEffect(() => {
    if (phase !== 'simulated') return
    setSimCount(1) // show first line immediately
    let i = 1
    const timer = setInterval(() => {
      i++
      if (i > simLines.length) {
        // Loop: keep last lines visible, don't add more
        clearInterval(timer)
        return
      }
      setSimCount(i)
    }, 800)
    return () => clearInterval(timer)
  }, [phase, simLines.length])

  // Transition to phase 2 when real entries arrive
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
      if (i >= entries.length) {
        clearInterval(timer)
        setPhase('done')
      }
    }, 300)
    return () => clearInterval(timer)
  }, [phase, entries])

  // Notify parent when done
  useEffect(() => {
    if (phase === 'done' && onAnimationDone) {
      onAnimationDone()
    }
  }, [phase, onAnimationDone])

  // Auto-scroll
  useEffect(() => {
    if (bottomRef.current && expanded) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [simCount, realCount, expanded])

  const isActive = phase === 'simulated' || phase === 'real'
  const isDone = phase === 'done'
  const displayEntries = phase === 'simulated'
    ? simLines.slice(0, simCount)
    : (entries || []).slice(0, realCount)
  const totalSteps = isDone && entries ? entries.length : null

  return (
    <div style={{
      background: '#1B2A4A',
      borderRadius: '12px',
      boxShadow: shadows.md,
      overflow: 'hidden',
      margin: '0 0 24px 0',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          cursor: 'pointer',
          background: '#162240',
          borderBottom: expanded ? '1px solid #2A3A5C' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px' }}>🤖</span>
          <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: '600' }}>
            Panel de Agentes
          </span>
          {isActive && (
            <span style={{
              display: 'inline-block',
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: '#E8721A',
              animation: 'agentPulse 1.5s ease-in-out infinite',
            }} />
          )}
          {totalSteps && (
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>
              — {totalSteps} pasos completados
            </span>
          )}
        </div>
        <span style={{
          color: '#94A3B8', fontSize: '14px',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▾</span>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{
          padding: '12px 16px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
        }}>
          {displayEntries.map((entry, i) => (
            <EntryRow key={phase === 'simulated' ? `sim-${i}` : `real-${i}`} entry={entry} visible={true} />
          ))}
          {/* Ghost next entry */}
          {phase === 'real' && entries && realCount < entries.length && (
            <EntryRow entry={entries[realCount]} visible={false} />
          )}
          {/* QA badge */}
          {isDone && qaReport && (
            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <ConfidenceBadge qaReport={qaReport} />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <style>{`@keyframes agentPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }`}</style>
    </div>
  )
}
