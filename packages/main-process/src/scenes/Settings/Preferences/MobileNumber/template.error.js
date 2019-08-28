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

const MobileNumber = props => {
  const { message } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.error.title'
            defaultMessage='Mobile number'
          />
          <Text>{message}</Text>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.error.description1'
            defaultMessage='Your mobile phone can be used to enable two-factor authentication,'
          />
          <FormattedMessage
            id='scenes.settings.preferences.mobile.error.description2'
            defaultMessage='helping to secure your wallet from unauthorized access,'
          />
          <FormattedMessage
            id='scenes.settings.preferences.mobile.error.description3'
            defaultMessage='and to send bitcoin payment alerts when you receive funds.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text>{message}</Text>
      </SettingComponent>
    </SettingContainer>
  )
}

export default MobileNumber
