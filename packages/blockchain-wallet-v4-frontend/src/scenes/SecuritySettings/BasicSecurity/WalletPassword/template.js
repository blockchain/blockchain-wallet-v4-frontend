import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import Setting from './Setting'

const WalletPassword = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.password.title' defaultMessage='Wallet password' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.password.description' defaultMessage='Your password is never shared with our servers, which means we cannot help reset your password if you forget it.' />
          <FormattedMessage id='scenes.settings.password.description2' defaultMessage='Make sure you write down your recovery phrase which can restore access to your wallet in the event of a lost password.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletPassword
