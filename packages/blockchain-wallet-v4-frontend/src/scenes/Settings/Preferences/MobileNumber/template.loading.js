import { FlatLoader } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import React from 'react'

const MobileNumber = props => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.loading.title'
            defaultMessage='Mobile Number'
          />
          <FlatLoader width='50px' height='14px' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.loading.description1'
            defaultMessage='Your mobile phone can be used to enable two-factor authentication,'
          />
          <FormattedMessage
            id='scenes.settings.preferences.mobile.loading.description2'
            defaultMessage='helping to secure your wallet from unauthorized access,'
          />
          <FormattedMessage
            id='scenes.settings.preferences.mobile.loading.description3'
            defaultMessage='and to send bitcoin payment alerts when you receive funds.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <FlatLoader width='50px' height='14px' />
      </SettingComponent>
    </SettingContainer>
  )
}

export default MobileNumber
