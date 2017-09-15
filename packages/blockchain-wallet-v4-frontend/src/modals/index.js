import React from 'react'

import AutoDisconnection from './AutoDisconnection'
import PairingCode from './PairingCode'
import QRCode from './QRCode'
import QRCodeCapture from './QRCodeCapture'
import RecoveryPhrase from './RecoveryPhrase'
import RequestBitcoin from './RequestBitcoin'
import SecondPassword from './SecondPassword'
import SendBitcoin from './SendBitcoin'
import TwoStepGoogleAuthenticator from './TwoStepGoogleAuthenticator'
import TwoStepMobile from './TwoStepMobile'
import TwoStepVerification from './TwoStepVerification'
import TwoStepYubico from './TwoStepYubico'

const Modals = props => (
  <div>
    <AutoDisconnection />
    <PairingCode />
    <QRCode />
    <QRCodeCapture />
    <RecoveryPhrase />
    <RequestBitcoin />
    <SecondPassword />
    <SendBitcoin />
    <TwoStepGoogleAuthenticator />
    <TwoStepMobile />
    <TwoStepVerification />
    <TwoStepYubico />
  </div>
)

export default Modals
