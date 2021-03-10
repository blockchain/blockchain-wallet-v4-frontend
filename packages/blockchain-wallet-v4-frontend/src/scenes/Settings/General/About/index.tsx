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

const About = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.about.title'
            defaultMessage='About'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.about.description'
            defaultMessage='Learn more about our company.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link href='https://www.blockchain.com/about' target='_blank'>
          <Button data-e2e='aboutLink' nature='empty-blue'>
            <Icon name='open-in-new-tab' size='20px' />
          </Button>
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default About
