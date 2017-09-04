import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Setting from './Setting'

const SecondPasswordWallet = (props) => {
  const { secondpasswordEnabled } = props
  const isEnabled = secondpasswordEnabled === 1

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.security.secondpassword.title' defaultMessage='Second wallet password' />
          <SettingStatus active={isEnabled}>
            {isEnabled
              ? <FormattedMessage id='scenes.security.secondpassword.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.security.secondpassword.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.security.secondpassword.description' defaultMessage='For additional security, you can choose a second password that is asked whenever you want to spend bitcoins.' />
          <FormattedMessage id='scenes.security.secondpassword.description2' defaultMessage='Beware that there is no password reset functionality.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default SecondPasswordWallet
