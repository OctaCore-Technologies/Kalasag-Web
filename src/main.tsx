import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/inter'
import './styles/global.css'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import { DataProvider } from './data/DataContext'

// Matches Vite's `base`, e.g. "/Kalasag-Web" on GitHub Pages.
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
