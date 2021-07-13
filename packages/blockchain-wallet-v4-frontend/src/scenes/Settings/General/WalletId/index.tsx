import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { Text } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { selectors } from 'data'

const WalletId = (props: Props) => {
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
          {props.guid}
        </Text>
      </SettingComponent>
    </SettingContainer>
  )
}

const mapStateToProps = state => ({
  guid: selectors.core.wallet.getGuid(state) as string
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(WalletId)
