import { Button, Icon, Link } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import React from 'react'

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
          <Button data-e2e='aboutLink' nature='empty'>
            <Icon name='open-in-new-tab' size='20px' />
          </Button>
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default About
