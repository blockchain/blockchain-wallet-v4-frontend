import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const SecondPasswordWallet = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.secondpassword.title' defaultMessage='Second wallet password' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.secondpassword.description' defaultMessage='For additional security, you can choose a second password that is asked whenever you want to spend bitcoins.' />
          <FormattedMessage id='scenes.settings.secondpassword.description2' defaultMessage='Beware that there is no password reset functionality.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='secondary'>
          <FormattedMessage id='scenes.settings.secondpassword.change' defaultMessage='Set second password' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default SecondPasswordWallet
