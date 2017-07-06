import React from 'react'
import { FormattedMessage } from 'react-intl'

import InfoWell from 'components/shared/InfoWell'
import SettingRow from 'components/shared/SettingRow'

import EmailAddress from './EmailAddress.js'
import MobileNumber from './MobileNumber'
import WalletLanguage from './WalletLanguage'
import LocalCurrency from './LocalCurrency'
import BitcoinUnit from './BitcoinUnit'
import Notifications from './Notifications'
import BitcoinLinkHandling from './BitcoinLinkHandling'
import AutoLogout from './AutoLogout'
import Themes from './Themes'

const PreferencesInfoWell = InfoWell.extend`
  margin-bottom: 30px;
  border-left: 5px solid #FFCF62;
`

const Preferences = (props) => {
  return (
    <section>
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

export default Preferences
