import React from 'react'
import styled from 'styled-components'

import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordStretching from './PasswordStretching'
import SecondPasswordWallet from './SecondPasswordWallet'
import TwoStepVerificationRemember from './TwoStepVerificationRemember'
import WalletAccessTor from './WalletAccessTor'
import WalletPassword from './WalletPassword'

const Wrapper = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eaeaea;
`

export default class AdvancedSecurity extends React.PureComponent {
  render() {
    return (
      <Wrapper>
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
