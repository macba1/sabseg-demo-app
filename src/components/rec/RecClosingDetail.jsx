import { useState } from 'react'
import { colors, card, btnPrimary, shadows } from '../../theme'

const saldosFile = { name: 'Saldos_Contables_Ene_y_Feb_2026.xlsx', size: '245 KB' }

const statsFiles = [
  '2026_02_ELEVIA.xlsx', '2026_02 AGRINALCAZAR AGRO.xlsx', '2026_02 Araytor.xlsx',
  '2026_02 FUTURA.xlsx', '2026_02 INSURART.xlsx', '2026_02 SANCHEZ VALENCIA.xlsx',
  '2026_02 SEGURETXE - v2.xlsx', '2026_02 Verobroker.xlsx', '2026_02 ZURRIOLA.xlsx',
  '02_2026 ADSA AGRO.xlsx', '02_2026 AISA AGRO.xlsx', '02_2026 BANA AGRO.xlsx',
  'MAURA.pdf', 'Recibos_ARRENTA_202602.xlsx',
]

function FileItem({ name }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', borderRadius: '6px',
      background: colors.bg, fontSize: '13px', color: colors.navy,
    }}>
      <span style={{ color: colors.green, fontSize: '14px' }}>✓</span>
      {name}
    </div>
  )
}

export default function RecClosingDetail({ cierre, onBack, onRun }) {
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: colors.gray,
          cursor: 'pointer', fontSize: '14px',
        }}>← Cierres</button>
        <span style={{ color: colors.border }}>/</span>
        <span style={{ color: colors.navy, fontWeight: '600', fontSize: '14px' }}>{cierre.label}</span>
      </div>

      <h1 style={{ color: colors.navy, fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
        {cierre.label}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Saldos contables */}
        <div style={{ ...card, padding: '20px' }}>
          <h3 style={{ color: colors.navy, fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Saldos contables
          </h3>
          <FileItem name={saldosFile.name} />
        </div>

        {/* Estadísticas de venta */}
        <div style={{ ...card, padding: '20px' }}>
          <h3 style={{ color: colors.navy, fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Estadísticas de venta ({statsFiles.length} ficheros)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '300px', overflowY: 'auto' }}>
            {statsFiles.map(f => <FileItem key={f} name={f} />)}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onRun}
          style={{
            ...btnPrimary,
            padding: '14px 40px',
            fontSize: '16px',
          }}
          onMouseEnter={e => e.target.style.background = '#D4650F'}
          onMouseLeave={e => e.target.style.background = colors.orange}
        >
          Ejecutar reconciliación
        </button>
      </div>
    </div>
  )
}
