import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/app.tsx'

import '@fontsource/poppins/400.css'; // Import specific weights/styles if needed.
import '@fontsource/poppins/500.css'; 
import '@fontsource/poppins/600.css'; 
import '@fontsource/poppins/700.css'; // For example, bold.
import '@fontsource/poppins/800.css'; // For example, bold.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
