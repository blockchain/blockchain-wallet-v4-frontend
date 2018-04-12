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

import { IconButton, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const AdvancedContainer = styled.div`
  margin-top: 0px !important;
`
const Advanced = ({ tabs, setView }) => (
  <AdvancedContainer>
    {!tabs && <IconButton name='left-arrow' onClick={() => setView('security')} id='advanced-button'>
      <Text size='14px' weight={300}>
        <FormattedMessage id='scenes.securitycenter.advanced.goback' defaultMessage='Go Back' />
      </Text>
    </IconButton>}
    <WalletPassword />
    <PasswordHint />
    <SecondPasswordWallet />
    <ActivityLogging />
    <IPWhitelist />
    <LoginIpRestriction />
    <WalletAccessTor />
    <PasswordStretching />
    <APIAccess />
  </AdvancedContainer>
)

export default Advanced
