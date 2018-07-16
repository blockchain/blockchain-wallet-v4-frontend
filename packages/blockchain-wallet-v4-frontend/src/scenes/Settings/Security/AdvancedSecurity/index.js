import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import InfoWell from 'components/InfoWell'
// import ActivityLogging from './ActivityLogging'
// import APIAccess from './APIAccess'
// import IPWhitelist from './IPWhitelist'
// import LoginIpRestriction from './LoginIpRestriction'
// import PasswordStretching from './PasswordStretching'
// import WalletAccessTor from './WalletAccessTor'

const Wrapper = styled.div``

const AdvancedSecurity = () => (
  <Wrapper>
    <InfoWell>
      <FormattedMessage id='scenes.settings.security.advancedsecurity.explain' defaultMessage='Advanced security: Further customize your security settings for more granular access control and tracking.' />
      <FormattedMessage id='scenes.settings.security.advancedsecurity.explain2' defaultMessage='Do not modify these settings unless you know what you are doing.' />
    </InfoWell>
    {/* <ActivityLogging />
    <LoginIpRestriction />
    <IPWhitelist />
    <WalletAccessTor />
    <PasswordStretching />
    <APIAccess /> */}
  </Wrapper>
)

export default AdvancedSecurity
