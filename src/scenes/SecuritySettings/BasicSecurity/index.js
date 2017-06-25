import React from 'react'
import { FormattedMessage } from 'react-intl'

import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'

import PasswordHint from '../PasswordHint'
import SecondPasswordWallet from '../SecondPasswordWallet'
import TwoStepVerification from '../TwoStepVerification'
import TwoStepVerificationRemember from '../TwoStepVerificationRemember'
import WalletPassword from '../WalletPassword'
import WalletRecoveryPhrase from '../WalletRecoveryPhrase'

const BasicSecurity = () => (
  <div>
    <InfoWell>
      <FormattedMessage id='scenes.settings.basicsecurity.explain' defaultMessage='Basic security: Make sure your details are accurate and up to date to keep your wallet safe from unauthorized access' />
      <FormattedMessage id='scenes.settings.basicsecurity.explain2' defaultMessage=' and to help you restore access to your wallet in the case of a Wallet ID or password loss.' />
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
