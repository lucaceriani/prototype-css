import React from 'react'
import ReactDOM from 'react-dom/client'

import '@picocss/pico'
import '../style.scss'
import { Options } from './options'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
