import React from 'react'

import AddBitcoinWallet from './AddBitcoinWallet'
import AutoDisconnection from './AutoDisconnection'
import ExchangeDetails from './ExchangeDetails'
import ImportBtcAddress from './ImportBtcAddress'
import MobileNumberChange from './MobileNumberChange'
import MobileNumberVerify from './MobileNumberVerify'
import MobileLogin from './MobileLogin'
import PairingCode from './PairingCode'
import PromptInput from './PromptInput'
import QRCode from './QRCode'
import RecoveryPhrase from './RecoveryPhrase'
import RequestBch from './RequestBch'
import RequestBitcoin from './RequestBitcoin'
import RequestEther from './RequestEther'
import SecondPassword from './SecondPassword'
import SendBch from './SendBch'
import SendBitcoin from './SendBitcoin'
import SendEther from './SendEther'
import TransactionReport from './TransactionReport'
import TransferEther from './TransferEther'
import TwoStepGoogleAuthenticator from './TwoStepGoogleAuthenticator'
import TwoStepSetup from './TwoStepSetup'
import TwoStepYubico from './TwoStepYubico'
import UpgradeWallet from './UpgradeWallet'
import Welcome from './Welcome'

const Modals = props => (
  <div>
    <AddBitcoinWallet />
    <AutoDisconnection />
    <ExchangeDetails />
    <ImportBtcAddress />
    <MobileNumberChange />
    <MobileNumberVerify />
    <MobileLogin />
    <PairingCode />
    <PromptInput />
    <QRCode />
    <RecoveryPhrase />
    <RequestBch />
    <RequestBitcoin />
    <RequestEther />
    <SecondPassword />
    <SendBch />
    <SendBitcoin />
    <SendEther />
    <TransactionReport />
    <TransferEther />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeWallet />
    <Welcome />
  </div>
)

export default Modals
