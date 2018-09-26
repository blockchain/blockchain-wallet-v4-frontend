import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { selectors } from 'data'
import { Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const WalletId = props => {
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
          />
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage
              id='scenes.settings.general.walletid.warning'
              defaultMessage='Do not share your Wallet ID with others.'
            />
          </Text>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text data-e2e='walletId'>{props.guid}</Text>
      </SettingComponent>
    </SettingContainer>
  )
}

const mapStateToProps = state => ({
  guid: selectors.core.wallet.getGuid(state)
})

export default connect(mapStateToProps)(WalletId)
