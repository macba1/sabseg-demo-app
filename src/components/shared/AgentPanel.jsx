import { useState, useEffect, useRef } from 'react'
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
  const dataEntries = hasData
    ? (Array.isArray(entry.data) ? entry.data : Object.entries(entry.data))
    : null

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
      {hasData && dataEntries && (
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

export default function AgentPanel({ entries, qaReport, defaultExpanded = true }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [visibleCount, setVisibleCount] = useState(0)
  const bottomRef = useRef(null)
  const allShown = entries && visibleCount >= entries.length

  // Animate entries appearing one by one
  useEffect(() => {
    if (!entries || entries.length === 0) return
    setVisibleCount(0)
    let i = 0
    const timer = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= entries.length) clearInterval(timer)
    }, 300)
    return () => clearInterval(timer)
  }, [entries])

  // Auto-scroll to bottom as entries appear
  useEffect(() => {
    if (bottomRef.current && expanded) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [visibleCount, expanded])

  // Collapse when all shown and defaultExpanded changes
  useEffect(() => {
    setExpanded(defaultExpanded)
  }, [defaultExpanded])

  if (!entries || entries.length === 0) return null

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
          {!allShown && (
            <span style={{
              display: 'inline-block',
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: '#E8721A',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          )}
          {allShown && (
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>
              — {entries.length} pasos completados
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
          {entries.slice(0, visibleCount).map((entry, i) => (
            <EntryRow key={i} entry={entry} visible={true} />
          ))}
          {/* Placeholder for next entry (animating in) */}
          {!allShown && entries[visibleCount] && (
            <EntryRow entry={entries[visibleCount]} visible={false} />
          )}
          {/* QA badge at the end */}
          {allShown && qaReport && (
            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <ConfidenceBadge qaReport={qaReport} />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }`}</style>
    </div>
  )
}
