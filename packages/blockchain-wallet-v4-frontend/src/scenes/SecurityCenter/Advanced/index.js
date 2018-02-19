import React from 'react'
import styled from 'styled-components'

import ActivityLogging from './ActivityLogging'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordStretching from './PasswordStretching'
import WalletAccessTor from './WalletAccessTor'
import PasswordHint from './PasswordHint'
import WalletPassword from './WalletPassword'
import SecondPasswordWallet from './SecondPasswordWallet'

const Wrapper = styled.div``

const Advanced = () => (
  <Wrapper>
    <WalletPassword />
    <PasswordHint />
    <SecondPasswordWallet />
    <ActivityLogging />
    <IPWhitelist />
    <LoginIpRestriction />
    <WalletAccessTor />
    <PasswordStretching />
    <APIAccess />
  </Wrapper>
)

export default Advanced
