import React from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'

import EmailAddress from './EmailAddress.js'
import MobileNumber from './MobileNumber'
import WalletLanguage from './WalletLanguage'
import LocalCurrency from './LocalCurrency'
import BitcoinUnit from './BitcoinUnit'
import Notifications from './Notifications'
import BitcoinLinkHandling from './BitcoinLinkHandling'
import AutoLogout from './AutoLogout'
import Themes from './Themes'

import style from './style.scss'

const PreferencesInfoWell = InfoWell.extend`
  margin-bottom: 30px;
  border-left: 5px solid #FFCF62;
`

const Preferences = (props) => {
  return (
    <section styleName='preferences'>
      <PreferencesInfoWell>
        <FormattedMessage id='scenes.preferences.explain' defaultMessage='Customize your wallet experience.' />
      </PreferencesInfoWell>
      <EmailAddress />
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

export default CSSModules(Preferences, style)
