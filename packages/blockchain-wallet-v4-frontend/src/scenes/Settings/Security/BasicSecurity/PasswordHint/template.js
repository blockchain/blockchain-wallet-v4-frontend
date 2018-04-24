import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Settings from './Settings'

const PasswordHint = (props) => {
  const { passwordHintStored } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.passwordhint.title' defaultMessage='Password Hint' />
          <SettingStatus active={passwordHintStored}>
            {passwordHintStored
              ? <FormattedMessage id='scenes.security.passwordhint.stored' defaultMessage='Hint Stored' />
              : <FormattedMessage id='scenes.security.passwordhint.notstored' defaultMessage='Not Stored' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.passwordhint.description1' defaultMessage='Blockchain cannot reset your password.' />
          <FormattedMessage id='scenes.settings.passwordhint.description2' defaultMessage='Create a memorable password hint that we can send to your verified email address in case you forget your password.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordHint
