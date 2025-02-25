import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ScrollContextProvider } from './contexts/scrollContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScrollContextProvider>
      <App />
    </ScrollContextProvider>
  </React.StrictMode>,
)
