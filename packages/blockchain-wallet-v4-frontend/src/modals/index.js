import React from 'react'

import AutoDisconnection from './AutoDisconnection'
import MobileNumberChange from './MobileNumberChange'
import MobileNumberVerify from './MobileNumberVerify'
import PairingCode from './PairingCode'
import QRCode from './QRCode'
import QRCodeCapture from './QRCodeCapture'
import RecoveryPhrase from './RecoveryPhrase'
import RequestBitcoin from './RequestBitcoin'
import SecondPassword from './SecondPassword'
import SendBitcoin from './SendBitcoin'
import TwoStepGoogleAuthenticator from './TwoStepGoogleAuthenticator'
import TwoStepSetup from './TwoStepSetup'
import TwoStepYubico from './TwoStepYubico'

const Modals = props => (
  <div>
    <AutoDisconnection />
    <MobileNumberChange />
    <MobileNumberVerify />
    <PairingCode />
    <QRCode />
    <QRCodeCapture />
    <RecoveryPhrase />
    <RequestBitcoin />
    <SecondPassword />
    <SendBitcoin />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
  </div>
)

export default Modals
