import React from 'react'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'

import style from './style.scss'
import EmailAddress from './EmailAddress'
import MobileNumber from './MobileNumber'
import WalletLanguage from './WalletLanguage'
import LocalCurrency from './LocalCurrency'
import BitcoinUnit from './BitcoinUnit'
import Notifications from './Notifications'
import BitcoinLinkHandling from './BitcoinLinkHandling'
import AutoLogout from './AutoLogout'
import Themes from './Themes'

const Preferences = () => {
  return (
    <section className={style.preferences}>
      <InfoWell>Customize your wallet experience.</InfoWell>
      <SettingRow component={EmailAddress} />
      <SettingRow component={MobileNumber} />
      <SettingRow component={WalletLanguage} />
      <SettingRow component={LocalCurrency} />
      <SettingRow component={BitcoinUnit} />
      <SettingRow component={Notifications} />
      <SettingRow component={BitcoinLinkHandling} />
      <SettingRow component={AutoLogout} />
      <SettingRow component={Themes} />
    </section>
  )
}

export default Preferences
