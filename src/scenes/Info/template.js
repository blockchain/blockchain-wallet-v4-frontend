import React from 'react'
import CSSModules from 'react-css-modules'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'

import Translate from 'components/Shared/Translate'
import WalletId from './WalletId'
import PairingCode from './PairingCode'

import style from './style.scss'

const Info = () => {
  return (
    <section styleName='information'>
      <InfoWell><Translate translate='WALLET_INFO_EXPLAIN' /></InfoWell>
      <SettingRow component={WalletId} />
      <SettingRow component={PairingCode} />
    </section>
  )
}

export default CSSModules(Info, style)
