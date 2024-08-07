import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CookiesProvider } from 'react-cookie'
import { enableMapSet } from 'immer'
import { Toaster } from "@/components/ui/sonner"


enableMapSet()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }}>
      <Toaster />
      <App />
    </CookiesProvider>
  </React.StrictMode>,
)
