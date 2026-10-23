import { createBrowserRouter } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Planned: /login, /rt/* (mobile layout, role rt), /desa/* (desktop layout, role desa), /403.
export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '*', element: <NotFoundPage /> },
])
