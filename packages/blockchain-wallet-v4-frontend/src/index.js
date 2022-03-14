// eslint-disable-next-line simple-import-sort/imports
import './create-nonce' // 👋 create-nonce needs to be imported first or it breaks styled-components
import 'regenerator-runtime/runtime.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import {
  FontGlobalStyles,
  IconGlobalStyles,
  Image,
  Text,
  TextGroup
} from 'blockchain-info-components'

import App from './scenes/app.tsx'
import configureStore from './store'

// load zxcvbn dependency async and set on window
// eslint-disable-next-line no-return-assign
require.ensure(['zxcvbn'], (require) => (window.zxcvbn = require('zxcvbn')), 'zxcvbn')

const ErrorWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const BlockchainLogoImage = styled(Image)`
  display: block;
  height: 25px;
  width: 200px;
`
const ErrorText = styled(Text)`
  color: white;
  font-weight: 400;
`
const BodyText = styled(TextGroup)`
  margin: 0 20px;
  text-align: center;
`

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
    ReactDOM.render(
      <ErrorWrapper>
        <Row>
          <BodyText>
            <ErrorText size='18px'>
              Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment.
              We&rsquo;ll be back online soon!
            </ErrorText>
          </BodyText>
        </Row>
        <Row style={{ marginTop: '60px' }}>
          <BlockchainLogoImage name='blockchain-logo' />
        </Row>
      </ErrorWrapper>,
      document.getElementById('app')
    )
    // eslint-disable-next-line no-console
    console.info(e)
  })
