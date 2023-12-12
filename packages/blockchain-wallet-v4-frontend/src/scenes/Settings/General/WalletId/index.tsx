import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { getGuid } from '@core/redux/wallet/selectors'
import { Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const WalletId = () => {
  const guid = useSelector(getGuid)

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.walletid.title'
            defaultMessage='Wallet ID'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.walletid.description'
            defaultMessage='Wallet ID is your unique identifier. It is completely individual to you, and it is what you will use to log in and access your wallet. It is NOT a bitcoin address for sending or receiving.'
          />{' '}
          <Text color='error' size='13px' weight={600}>
            <FormattedMessage
              id='scenes.settings.general.walletid.warning'
              defaultMessage='Do not share your Wallet ID with others.'
            />
          </Text>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text color='grey800' data-e2e='walletId' size='14px' weight={600}>
          {guid}
        </Text>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletId
