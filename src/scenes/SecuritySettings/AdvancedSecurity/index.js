import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-components'
import InfoWell from 'components/shared/InfoWell'
import ActivityLogging from './ActivityLogging'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordStretching from './PasswordStretching'
import WalletAccessTor from './WalletAccessTor'

const Wrapper = styled.div``

const AdvancedSecurity = () => (
  <Wrapper>
    <InfoWell>
      <Text id='scenes.settings.advancedsecurity.explain' text='Advanced security: Further customize your security settings for more granular access control and tracking.' small />
      <Text id='scenes.settings.advancedsecurity.explain2' text='Do not modify these settings unless you know what you are doing.' small />
    </InfoWell>
    <ActivityLogging />
    <LoginIpRestriction />
    <IPWhitelist />
    <WalletAccessTor />
    <PasswordStretching />
    <APIAccess />
  </Wrapper>
)

export default AdvancedSecurity
