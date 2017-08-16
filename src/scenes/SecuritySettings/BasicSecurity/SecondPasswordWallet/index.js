import React from 'react'

import { SecondaryButton, Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const SecondPasswordWallet = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.secondpassword.title' text='Second wallet password' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.secondpassword.description' text='For additional security, you can choose a second password that is asked whenever you want to spend bitcoins.' altFont light />
          <Text id='scenes.settings.secondpassword.description2' text='Beware that there is no password reset functionality.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.secondpassword.change' text='Set second password' small light white capitalize />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default SecondPasswordWallet
