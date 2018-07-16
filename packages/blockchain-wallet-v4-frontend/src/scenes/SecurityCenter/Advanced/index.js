import React, { PureComponent } from 'react'
import styled from 'styled-components'

import ActivityLogging from './ActivityLogging'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordStretching from './PasswordStretching'
import WalletAccessTor from './WalletAccessTor'
import TwoStepVerificationRemember from './TwoStepVerificationRemember'
// import PasswordHint from './PasswordHint'
import WalletPassword from './WalletPassword'
import SecondPasswordWallet from './SecondPasswordWallet'
import { IconButton } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const AdvancedContainer = styled.div`
  margin-top: 0 !important;
`
const BackButton = styled(IconButton)`
  margin-bottom: 6px;
`

export default class Advanced extends PureComponent {
  componentDidMount () {
    if (!this.props.showTabs) {
      const button = document.getElementById('advanced-button')
      const alignToTop = false
      button.scrollIntoView(alignToTop)
    }
  }

  render () {
    return (
      <AdvancedContainer>
        {!this.props.showTabs &&
          <BackButton name='left-arrow' nature='empty' onClick={() => this.props.setView('security')} id='advanced-button'>
            <FormattedMessage id='scenes.securitycenter.advanced.back' defaultMessage='Back' />
          </BackButton>
        }
        <WalletPassword />
        {/* <PasswordHint /> */}
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
