import React from 'react'

import AutoDisconnection from './AutoDisconnection'
import MobileNumberChange from './MobileNumberChange'
import MobileNumberVerify from './MobileNumberVerify'
import MobileLogin from './MobileLogin'
import PairingCode from './PairingCode'
import QRCode from './QRCode'
import QRCodeCapture from './QRCodeCapture'
import RecoveryPhrase from './RecoveryPhrase'
import RequestBitcoin from './RequestBitcoin'
import SecondPassword from './SecondPassword'
import SendBitcoin from './SendBitcoin'
import TransactionReport from './TransactionReport'
import TwoStepCivic from './TwoStepCivic'
import TwoStepGoogleAuthenticator from './TwoStepGoogleAuthenticator'
import TwoStepSetup from './TwoStepSetup'
import TwoStepYubico from './TwoStepYubico'
import UpgradeWallet from './UpgradeWallet'
import Welcome from './Welcome'

const Modals = props => (
  <div>
    <AutoDisconnection />
    <MobileNumberChange />
    <MobileNumberVerify />
    <MobileLogin />
    <PairingCode />
    <QRCode />
    <QRCodeCapture />
    <RecoveryPhrase />
    <RequestBitcoin />
    <SecondPassword />
    <SendBitcoin />
    <TransactionReport />
    <TwoStepCivic />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeWallet />
    <Welcome />
  </div>
)

export default Modals
