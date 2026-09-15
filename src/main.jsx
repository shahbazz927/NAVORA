import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { validateGraduationProfiles } from './data/graduationDegreeConfig.js'

if (import.meta.env.DEV) {
  const problems = validateGraduationProfiles()
  if (problems.length > 0) {
    console.warn('Graduation profile validation found issues:')
    problems.forEach((p) => console.warn(' -', p))
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
