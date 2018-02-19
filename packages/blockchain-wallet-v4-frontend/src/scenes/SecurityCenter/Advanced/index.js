import React from 'react'
import styled from 'styled-components'

import ActivityLogging from './ActivityLogging'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordStretching from './PasswordStretching'
import WalletAccessTor from './WalletAccessTor'

const Wrapper = styled.div``

const Advanced = () => (
  <Wrapper>
    <ActivityLogging />
    <LoginIpRestriction />
    {/* <IPWhitelist /> */}
    <WalletAccessTor />
    <PasswordStretching />
    <APIAccess />
  </Wrapper>
)

export default Advanced
