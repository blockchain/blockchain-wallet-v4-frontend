import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const AutoLogout = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.autologout.title' defaultMessage='Auto logout' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.autologout.description' defaultMessage='After a certain period of inactivity, you will be automatically logged out of your wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text>10 minutes</Text>
        <Button type='secondary'>
          <FormattedMessage id='scenes.preferences.autologout.change' defaultMessage='change' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default AutoLogout
