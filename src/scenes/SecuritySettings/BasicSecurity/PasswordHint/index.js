import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const PasswordHint = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.passwordhint.title' defaultMessage='Password hint' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.passwordhint.description' defaultMessage='Your Blockchain Wallet never communicates your password to our servers.' />
          <FormattedMessage id='scenes.settings.passwordhint.description2' defaultMessage='This means we have no idea what your password is and we cannot reset it if you forget it.' />
          <FormattedMessage id='scenes.settings.passwordhint.description3' defaultMessage='Create a memorable password hint that we can send to your verified email address in case you forget your password.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button type='secondary'>
          <FormattedMessage id='scenes.settings.passwordhint.change' defaultMessage='Change' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordHint
