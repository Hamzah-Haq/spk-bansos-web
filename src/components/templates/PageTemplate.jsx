import PageHeader from '../molecules/PageHeader.jsx'

// Content area of a menu page inside DashboardTemplate: centered column, header, then sections.
export default function PageTemplate({ title, description, actions, children }) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={actions}
      />
      {children}
    </div>
  )
}
