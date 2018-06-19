import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import InfoWell from 'components/InfoWell'
import WalletId from './WalletId'
import PairingCode from './PairingCode'

const Wrapper = styled.section`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

const Info = () => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <InfoWell>
          <FormattedMessage id='scenes.settings.info.explain' defaultMessage='Use your Wallet ID to log in using our web client,' />
          <FormattedMessage id='scenes.settings.info.explain2' defaultMessage="or simply scan the code below (click on 'Show Pairing Code') with your Blockchain Mobile Wallet (iOS or Android) to access your wallet on your mobile devices." />
        </InfoWell>
        <WalletId />
        <PairingCode />
      </Wrapper>
    </ErrorBoundary>
  )
}

export default Info
