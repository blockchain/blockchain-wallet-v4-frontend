import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const PrivacyPolicy = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.privacypolicy.title'
            defaultMessage='Privacy Policy'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.privacypolicy.description'
            defaultMessage='Read about the privacy and security of your personal information.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button>Here</Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PrivacyPolicy
