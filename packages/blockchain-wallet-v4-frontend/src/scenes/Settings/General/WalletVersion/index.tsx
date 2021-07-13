import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import {
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { selectors } from 'data'

const WalletVersion = (props: Props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.wallet_version.title'
            defaultMessage='Wallet Version'
          />
        </SettingHeader>
        <SettingDescription>{props.version}</SettingDescription>
      </SettingSummary>
    </SettingContainer>
  )
}

const mapStateToProps = state => ({
  version: selectors.core.wallet.getVersion(state) as string
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(WalletVersion)
