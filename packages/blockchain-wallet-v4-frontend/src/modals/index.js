import React from 'react'

import AutoDisconnection from './AutoDisconnection'
import MobileNumberChange from './MobileNumberChange'
import MobileNumberVerify from './MobileNumberVerify'
import MobileLogin from './MobileLogin'
import PairingCode from './PairingCode'
import QRCode from './QRCode'
import RecoveryPhrase from './RecoveryPhrase'
import RequestBitcoin from './RequestBitcoin'
import RequestEther from './RequestEther'
import SecondPassword from './SecondPassword'
import SendBitcoin from './SendBitcoin'
import SendEther from './SendEther'
import TransactionReport from './TransactionReport'
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
    <RecoveryPhrase />
    <RequestBitcoin />
    <RequestEther />
    <SecondPassword />
    <SendBitcoin />
    <SendEther />
    <TransactionReport />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeWallet />
    <Welcome />
  </div>
)

export default Modals
