// eslint-disable-next-line simple-import-sort/imports
import './create-nonce' // 👋 create-nonce needs to be imported first or it breaks styled-components
import 'regenerator-runtime/runtime.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { analyticsTrackingNoStore } from 'services/tracking'

import { FontGlobalStyles, IconGlobalStyles } from 'blockchain-info-components'

import App from './scenes/app.tsx'
import configureStore from './store'
import Maintenance from './scenes/Maintenance'

configureStore()
  .then((root) => {
    ReactDOM.render(
      <>
        <BrowserRouter>
          <App store={root.store} history={root.history} persistor={root.persistor} />
        </BrowserRouter>
        <FontGlobalStyles />
        <IconGlobalStyles />
      </>,
      document.getElementById('app')
    )
  })
  .catch((e) => {
    ReactDOM.render(<Maintenance />, document.getElementById('app'))
    const data = {
      events: [
        {
          name: 'Wallet Load Failure',
          originalTimestamp: new Date(),
          properties: {
            error_message: e.toString()
          }
        }
      ]
    }
    analyticsTrackingNoStore(data)
    console.error(e)
  })
