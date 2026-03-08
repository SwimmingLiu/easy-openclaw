// main.tsx
// Application entry point

import * as React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { logger } from './lib/logger'

// Global error handlers for logging
// Capture uncaught JavaScript errors
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Uncaught error', {
    message: String(message),
    source,
    lineno,
    colno,
    stack: error?.stack,
  })
  return false
}

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', {
    reason: event.reason instanceof Error 
      ? { message: event.reason.message, stack: event.reason.stack }
      : String(event.reason),
  })
})

// Capture resource loading errors (images, scripts, etc.)
window.addEventListener(
  'error',
  (event) => {
    if (event.target !== window) {
      const target = event.target as HTMLElement
      logger.error('Resource loading error', {
        tagName: target.tagName,
        src: (target as HTMLImageElement).src || (target as HTMLScriptElement).src,
      })
    }
  },
  true // Use capture phase to catch all resource errors
)

// Initialize the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
