import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { router } from './router.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import { applyTheme, loadThemeId } from './theme/themes.js'

applyTheme(loadThemeId())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
