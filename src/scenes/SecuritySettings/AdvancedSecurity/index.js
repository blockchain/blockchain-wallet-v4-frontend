import React from 'react'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'
import Translate from 'components/Shared/Translate'

import ActivityLogging from '../ActivityLogging'
import APIAccess from '../APIAccess'
import IPWhitelist from '../IPWhitelist'
import LoginIpRestriction from '../LoginIpRestriction'
import PasswordStretching from '../PasswordStretching'
import WalletAccessTor from '../WalletAccessTor'

const AdvancedSecurity = () => (
  <div>
    <InfoWell>
      <Translate translate='SECURITY_ADVANCED_EXPLAIN' />
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
