import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/components/CSS/index.css'
import App from '../src/components/App/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
