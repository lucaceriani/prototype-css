import React, { useImperativeHandle } from 'react'
import ReactDOM from 'react-dom/client'
import { Popup } from './popup'

import '@picocss/pico'
import './popup.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
