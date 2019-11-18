import React from 'react'

import { Confirm, PromptInput } from './Generic'
import { MobileNumberChange, MobileNumberVerify } from './Mobile'
import QRCode from './QRCode'
import {
  ConfirmDisable2FA,
  SecondPassword,
  TwoStepGoogleAuthenticator,
  TwoStepSetup,
  TwoStepYubico
} from './Settings'
import { PairingCode, UpgradeWallet } from './Wallet'

const Modals = () => (
  <div>
    <Confirm />
    <ConfirmDisable2FA />
    <MobileNumberChange />
    <MobileNumberVerify />
    <PairingCode />
    <PromptInput />
    <QRCode />
    <SecondPassword />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeWallet />
  </div>
)

export default Modals
