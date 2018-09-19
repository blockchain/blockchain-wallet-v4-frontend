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

const TermsOfService = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.termsofservice.title'
            defaultMessage='About'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.termsofservice.description'
            defaultMessage='Read our terms and services agreement.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button>Here</Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default TermsOfService
