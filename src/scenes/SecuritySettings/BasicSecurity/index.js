import React from 'react'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'
import Translate from 'components/Shared/Translate'

import PasswordHint from '../PasswordHint'
import SecondPasswordWallet from '../SecondPasswordWallet'
import TwoStepVerification from '../TwoStepVerification'
import TwoStepVerificationRemember from '../TwoStepVerificationRemember'
import WalletPassword from '../WalletPassword'
import WalletRecoveryPhrase from '../WalletRecoveryPhrase'

const BasicSecurity = () => (
  <div>
    <InfoWell>
      <Translate translate='SECURITY_BASIC_EXPLAIN' />
    </InfoWell>
    <SettingRow component={WalletRecoveryPhrase} />
    <SettingRow component={WalletPassword} />
    <SettingRow component={PasswordHint} />
    <SettingRow component={SecondPasswordWallet} />
    <SettingRow component={TwoStepVerification} />
    <SettingRow component={TwoStepVerificationRemember} />
  </div>
)

export default BasicSecurity
