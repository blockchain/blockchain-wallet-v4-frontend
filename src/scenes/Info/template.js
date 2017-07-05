import React from 'react'
import { FormattedMessage } from 'react-intl'

import InfoWell from 'components/shared/InfoWell'
import SettingRow from 'components/shared/SettingRow'

import WalletId from './WalletId'
import PairingCode from './PairingCode'

const Info = () => {
  return (
    <section>
      <InfoWell>
        <FormattedMessage id='scenes.info.explain' defaultMessage='Use your Wallet ID to log in using our web client,' />
        <FormattedMessage id='scenes.info.explain2' defaultMessage='or simply scan the code below (click on `Show Pairing Code`) with your Blockchain Mobile Wallet (iOS or Android) to access your wallet on your mobile devices.' />
      </InfoWell>
      <SettingRow component={WalletId} />
      <SettingRow component={PairingCode} />
    </section>
  )
}

export default Info
