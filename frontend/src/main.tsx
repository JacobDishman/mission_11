// main.tsx — entry point of the React app.
// This is where React attaches to the DOM and where we import global stuff.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap CSS — import globally so all components can use bootstrap classes
import 'bootstrap/dist/css/bootstrap.min.css'

// Bootstrap JS — needed for interactive stuff like Offcanvas and Toasts.
// We import the whole bundle and put it on window so we can use it in components.
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).bootstrap = bootstrap;

import './index.css'
import App from './App.tsx'

// Render the app into the root div in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
