import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Text, TextGroup } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const BitcoinLinkHandling = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.link.title' defaultMessage='Bitcoin link handling' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.link.description' defaultMessage='Enable this to allow your Blockchain Wallet to handle bitcoin payment links in the web browser.' />
          <FormattedMessage id='scenes.preferences.link.description2' defaultMessage='This will make your experience more convenient when transacting online.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='secondary'>
          <FormattedMessage id='scenes.preferences.link.enable' defaultMessage='Enable' />
        </Button>
        <TextGroup inline>
          <Text color='mahogany' weight={300} size='14px'>
            <FormattedMessage id='scenes.preferences.link.unknownstatus' defaultMessage="We can't detect whether or not handling of bitcoin links has been enabled." />
          </Text>
          <Text color='mahogany' weight={300} size='14px'>
            <FormattedMessage id='scenes.preferences.link.unknownstatus2' defaultMessage='If it has already been enabled, nothing will happen.' />
          </Text>
        </TextGroup>
      </SettingComponent>
    </SettingContainer>
  )
}

export default BitcoinLinkHandling
