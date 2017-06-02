import React from 'react'

import Basic from './Basic'
import Advanced from './Advanced'
import ActivityLogging from './ActivityLogging'
import APIAccess from './APIAccess'
import IPWhitelist from './IPWhitelist'
import LoginIpRestriction from './LoginIpRestriction'
import PasswordHint from './PasswordHint'
import PasswordStretching from './PasswordStretching'
import SecondPasswordWallet from './SecondPasswordWallet'
import TwoStepVerification from './TwoStepVerification'
import TwoStepVerificationRemember from './TwoStepVerificationRemember'
import WalletAccessTor from './WalletAccessTor'
import WalletPassword from './WalletPassword'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'
import InfoWell from 'components/Shared/InfoWell'
import SettingRow from 'components/Shared/SettingRow'

import style from './style.scss'

const SecuritySettings = ({ advanced, toggleAdvanced }) => {
  let advancedButtonClass = 'button-default' + (advanced ? ' active' : '')
  return (
    <section className={style.securitySettings}>
      {/*
      <Basic />
      <div style={{ paddingTop: 16, paddingBottom: 40 }}>
        <button className={advancedButtonClass} onClick={toggleAdvanced}>Advanced Settings</button>
      </div>
      */}
      {/*advanced && (<Advanced />)*/}

      <InfoWell>
        Basic security: Make sure your details are accurate and up to date to keep
        your wallet safe from unauthorized access and to help you restore access to
        your wallet in the case of a Wallet ID or password loss.
      </InfoWell>
      <SettingRow component={WalletRecoveryPhrase} />
      <SettingRow component={WalletPassword} />
      <SettingRow component={PasswordHint} />
      <SettingRow component={SecondPasswordWallet} />
      <SettingRow component={TwoStepVerification} />
      <SettingRow component={TwoStepVerificationRemember} />
      <SettingRow component={ActivityLogging} />
      <SettingRow component={LoginIpRestriction} />
      <SettingRow component={IPWhitelist} />
      <SettingRow component={WalletAccessTor} />
      <SettingRow component={PasswordStretching} />
      <SettingRow component={APIAccess} />
    </section>
  )
}

export default SecuritySettings
