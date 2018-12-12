import React from 'react'
import styled from 'styled-components'

import ActivityLogging from './ActivityLogging'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordStretching from './PasswordStretching'
import WalletAccessTor from './WalletAccessTor'
import TwoStepVerificationRemember from './TwoStepVerificationRemember'
import WalletPassword from './WalletPassword'
import SecondPasswordWallet from './SecondPasswordWallet'

const AdvancedContainer = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eaeaea;
`

export default class Advanced extends React.PureComponent {
  render () {
    return (
      <AdvancedContainer>
        <WalletPassword />
        <SecondPasswordWallet />
        <TwoStepVerificationRemember />
        <ActivityLogging />
        <IPWhitelist />
        <LoginIpRestriction />
        <WalletAccessTor />
        <PasswordStretching />
        <APIAccess />
      </AdvancedContainer>
    )
  }
}
