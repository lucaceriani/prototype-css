import React from 'react'
import ReactDOM from 'react-dom/client'
import { Options } from './options'

import '@picocss/pico'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../style.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
