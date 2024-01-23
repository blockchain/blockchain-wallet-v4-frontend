import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import {
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { selectors } from 'data'

const WalletVersion = () => {
  const walletVersion = useSelector(selectors.core.wallet.getVersion)

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.wallet_version.title'
            defaultMessage='Wallet Version'
          />
        </SettingHeader>
        <SettingDescription>{walletVersion}</SettingDescription>
      </SettingSummary>
    </SettingContainer>
  )
}

export default WalletVersion
