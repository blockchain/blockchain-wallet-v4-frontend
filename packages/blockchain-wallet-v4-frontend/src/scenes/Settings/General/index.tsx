import { Banner, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import About from './About'
import LinkedCards from './LinkedCards'
import PairingCode from './PairingCode'
import PrivacyPolicy from './PrivacyPolicy'
import React from 'react'
import styled from 'styled-components'
import TermsOfService from './TermsOfService'
import WalletId from './WalletId'

const Wrapper = styled.section``

const General = () => {
  return (
    <Wrapper>
      <Banner type='alert'>
        <Text color='blue600' size='14px'>
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
      <LinkedCards />
      <PrivacyPolicy />
      <TermsOfService />
      <About />
    </Wrapper>
  )
}

export default General
