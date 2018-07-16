import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import Settings from './Settings'

const WalletId = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.info.walletid.title' defaultMessage='Wallet ID' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.info.walletid.description' defaultMessage='Wallet ID is your unique identifier.' />
          <FormattedMessage id='scenes.info.walletid.description2' defaultMessage='It is completely individual to you, and it is what you will use to log in and access your wallet.' />
          <FormattedMessage id='scenes.info.walletid.description3' defaultMessage='It is NOT a bitcoin address for sending or receiving.' />
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage id='scenes.info.walletid.warning' defaultMessage='Do not share your Wallet ID with others.' />
          </Text>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletId
