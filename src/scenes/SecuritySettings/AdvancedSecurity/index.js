import React from 'react'
import { FormattedMessage } from 'react-intl'

import InfoWell from 'components/shared/InfoWell'
import SettingRow from 'components/shared/SettingRow'

import ActivityLogging from '../ActivityLogging'
import APIAccess from '../APIAccess'
import IPWhitelist from '../IPWhitelist'
import LoginIpRestriction from '../LoginIpRestriction'
import PasswordStretching from '../PasswordStretching'
import WalletAccessTor from '../WalletAccessTor'

const AdvancedSecurity = () => (
  <div>
    <InfoWell>
      <FormattedMessage id='scenes.settings.advancedsecurity.explain' defaultMessage='Advanced security: Further customize your security settings for more granular access control and tracking.' />
      <FormattedMessage id='scenes.settings.advancedsecurity.explain2' defaultMessage='Do not modify these settings unless you know what you are doing.' />
    </InfoWell>
    <SettingRow component={ActivityLogging} />
    <SettingRow component={LoginIpRestriction} />
    <SettingRow component={IPWhitelist} />
    <SettingRow component={WalletAccessTor} />
    <SettingRow component={PasswordStretching} />
    <SettingRow component={APIAccess} />
  </div>
)

export default AdvancedSecurity
