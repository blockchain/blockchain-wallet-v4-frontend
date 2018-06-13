import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Text, TextGroup } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const BitcoinLinkHandling = (props) => {
  const { warningDisplayed, handleClick } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.preferences.bitcoinlinkhandling.title' defaultMessage='Bitcoin Link Handling' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.preferences.bitcoinlinkhandling.description' defaultMessage='Enable this to allow your Blockchain Wallet to handle bitcoin payment links in the web browser.' />
          <FormattedMessage id='scenes.settings.preferences.bitcoinlinkhandling.description2' defaultMessage='This will make your experience more convenient when transacting online.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={handleClick}>
          <FormattedMessage id='scenes.settings.preferences.bitcoinlinkhandling.enable' defaultMessage='Enable' />
        </Button>
        { warningDisplayed &&
          <TextGroup inline>
            <Text size='14px' weight={300} color='error'>
              <FormattedMessage id='scenes.settings.preferences.bitcoinlinkhandling.unknownstatus' defaultMessage="We can't detect whether or not handling of bitcoin links has been enabled." />
            </Text>
            <Text size='14px' weight={300} color='error'>
              <FormattedMessage id='scenes.settings.preferences.bitcoinlinkhandling.unknownstatus2' defaultMessage='If it has already been enabled, nothing will happen.' />
            </Text>
          </TextGroup>
        }
      </SettingComponent>
    </SettingContainer>
  )
}

export default BitcoinLinkHandling
