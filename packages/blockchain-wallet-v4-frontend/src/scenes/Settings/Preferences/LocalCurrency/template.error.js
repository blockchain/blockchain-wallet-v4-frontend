import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const LocalCurrency = props => {
  const { message } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.localcurrency.error.title'
            defaultMessage='Local Currency'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.localcurrency.error.description'
            defaultMessage='Select your local currency.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text>{message}</Text>
      </SettingComponent>
    </SettingContainer>
  )
}

export default LocalCurrency
