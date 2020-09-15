import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { selectors } from 'data'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { Text } from 'blockchain-info-components'
import React from 'react'

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
          <Text size='14px' weight={400} color='error'>
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
  guid: selectors.core.wallet.getGuid(state) as string
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(WalletId)
