import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Setting from './Setting'

const PasswordHint = (props) => {
  const { passwordHintStored } = props
  console.log(passwordHintStored)
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.passwordHint.title' defaultMessage='Password hint' />
          <SettingStatus active={passwordHintStored}>
            {passwordHintStored
              ? <FormattedMessage id='scenes.security.passwordHint.stored' defaultMessage='Hint Stored' />
              : <FormattedMessage id='scenes.security.passwordHint.notstored' defaultMessage='Not Stored' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.passwordHint.description' defaultMessage='Your Blockchain Wallet never communicates your password to our servers.' />
          <FormattedMessage id='scenes.settings.passwordHint.description2' defaultMessage='This means we have no idea what your password is and we cannot reset it if you forget it.' />
          <FormattedMessage id='scenes.settings.passwordHint.description3' defaultMessage='Create a memorable password hint that we can send to your verified email address in case you forget your password.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordHint
