import FileRepository from '../shared/FileRepository'

const sections = [
  {
    id: 'recibos',
    label: 'Ficheros de recibos de corredurías',
    icon: '🗂️',
    demoFiles: [
      'Recibos_Araytor_202602.xlsx',
      'Recibos_Zurriola_202602.xlsx',
      'Recibos_Seguretxe_202602.xlsx',
      'Recibos_Arrenta_202601.xlsx',
      'Recibos_Arrenta_202602.xlsx',
    ],
  },
]

export default function DQWorkspace({ onRunDemo, onRunUpload }) {
  return (
    <FileRepository
      sections={sections}
      onRunDemo={onRunDemo}
      onRunUpload={onRunUpload}
      runLabel="Validar entregas"
    />
  )
}
