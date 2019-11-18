import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Banner, Text } from 'blockchain-info-components'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PairingCode from './PairingCode'
import PasswordStretching from './PasswordStretching'
import WalletAccessTor from './WalletAccessTor'
import WalletId from './WalletId'
import TwoStepVerificationRemember from './TwoStepVerificationRemember'
import WalletPassword from './WalletPassword'
import SecondPasswordWallet from './SecondPasswordWallet'

const Wrapper = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eaeaea;
`

export default class AdvancedSecurity extends React.PureComponent {
  render () {
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
        <WalletPassword />
        <SecondPasswordWallet />
        <TwoStepVerificationRemember />
        <IPWhitelist />
        <LoginIpRestriction />
        <WalletAccessTor />
        <PasswordStretching />
        <APIAccess />
      </Wrapper>
    )
  }
}
