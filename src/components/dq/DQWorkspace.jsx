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

export default function DQWorkspace({ onRun }) {
  return (
    <FileRepository
      sections={sections}
      onRun={onRun}
      runLabel="Validar entregas"
      variant="dq"
    />
  )
}
