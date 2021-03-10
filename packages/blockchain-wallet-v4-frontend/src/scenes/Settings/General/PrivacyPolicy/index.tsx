import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Link } from 'blockchain-info-components'
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
        <Link href='https://www.blockchain.com/legal/privacy' target='_blank'>
          <Button data-e2e='privacyLink' nature='empty-blue'>
            <Icon name='open-in-new-tab' size='20px' />
          </Button>
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PrivacyPolicy
