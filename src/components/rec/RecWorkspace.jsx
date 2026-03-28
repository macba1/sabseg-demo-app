import FileRepository from '../shared/FileRepository'

const sections = [
  {
    id: 'saldos',
    label: 'Saldos contables',
    icon: '📒',
    demoFiles: ['Saldos_Contables_Ene_y_Feb_2026.xlsx'],
  },
  {
    id: 'stats',
    label: 'Estadísticas de venta',
    icon: '📈',
    demoFiles: [
      '2026_02_ELEVIA.xlsx',
      '2026_02 AGRINALCAZAR AGRO.xlsx',
      '2026_02 Araytor.xlsx',
      '2026_02 FUTURA.xlsx',
      '2026_02 INSURART.xlsx',
      '2026_02 SANCHEZ VALENCIA.xlsx',
      '2026_02 SEGURETXE - v2.xlsx',
      '2026_02 Verobroker.xlsx',
      '2026_02 ZURRIOLA.xlsx',
      '02_2026 ADSA AGRO.xlsx',
      '02_2026 AISA AGRO.xlsx',
      '02_2026 BANA AGRO.xlsx',
      'MAURA.pdf',
      'Recibos_ARRENTA_202602.xlsx',
    ],
  },
]

export default function RecWorkspace({ onRun }) {
  return (
    <FileRepository
      sections={sections}
      onRun={onRun}
      runLabel="Ejecutar reconciliación"
      variant="rec"
    />
  )
}
