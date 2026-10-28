import StatusTemplate from '../components/templates/StatusTemplate.jsx'

export default function NotFoundPage() {
  return (
    <StatusTemplate
      code="404"
      message="Halaman tidak ditemukan."
    />
  )
}
