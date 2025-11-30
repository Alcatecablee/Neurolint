import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Index from './Index.tsx'
import { QuickStart } from './QuickStart.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quick-start" element={<QuickStart />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>,
)
