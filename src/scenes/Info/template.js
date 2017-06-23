import React from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'

import WalletId from './WalletId'
import PairingCode from './PairingCode'

import style from './style.scss'

const Info = () => {
  return (
    <section styleName='information'>
      <InfoWell>
        <FormattedMessage id='scenes.info.explain' defaultMessage='Use your Wallet ID to log in using our web client,
        or simply scan the code below (click on `Show Pairing Code`) with your Blockchain Mobile Wallet (iOS or Android) 
        to access your wallet on your mobile devices.' />
      </InfoWell>
      <SettingRow component={WalletId} />
      <SettingRow component={PairingCode} />
    </section>
  )
}

export default CSSModules(Info, style)
