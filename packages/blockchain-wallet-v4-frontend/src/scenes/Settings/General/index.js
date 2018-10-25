import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Banner, Text } from 'blockchain-info-components'

import About from './About'
import PairingCode from './PairingCode'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import WalletId from './WalletId'

const Wrapper = styled.section`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

const General = () => {
  return (
    <Wrapper>
      <Banner type='alert'>
        <Text color='brand-secondary' size='14px'>
          <FormattedMessage
            id='scenes.settings.general.explain'
            defaultMessage='Use your Wallet ID to log in using our web client,'
          />
          <span>&nbsp;</span>
          <FormattedMessage
            id='scenes.settings.general.explain2'
            defaultMessage="or simply scan the code below (click on 'Show Pairing Code') with your Blockchain Mobile Wallet (iOS or Android) to access your wallet on your mobile devices."
          />
        </Text>
      </Banner>
      <WalletId />
      <PairingCode />
      <PrivacyPolicy />
      <TermsOfService />
      <About />
    </Wrapper>
  )
}

export default General
