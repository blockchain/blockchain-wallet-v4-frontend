import React from 'react'

import {
  DeleteAddressLabel,
  ShowUsedAddresses,
  UpgradeAddressLabels
} from './Addresses'
import AutoDisconnection from './AutoDisconnection'
import { RequestBch, SendBch } from './Bch'
import {
  AddBtcWallet,
  ImportBtcAddress,
  RequestBtc,
  SendBtc,
  ShowBtcPrivateKey
} from './Btc'
import {
  CoinifyDeleteBank,
  CoinifyExchangeData,
  CoinifyTradeDetails
} from './Coinify'
import Confirm from './Confirm'
import EditTxDescription from './EditTxDescription'
import { RequestEth, SendEth, ShowEthPrivateKey, TransferEth } from './Eth'
import {
  ExchangeDetails,
  ExchangeResults,
  IdentityVerification,
  UserExists
} from './Exchange'
import {
  LockboxAppInstall,
  LockboxFirmware,
  LockboxSetup,
  PromptLockbox
} from './Lockbox'
import { MobileLogin, MobileNumberChange, MobileNumberVerify } from './Mobile'
import Onfido from './Onfido'
import PromptInput from './PromptInput'
import QRCode from './QRCode'
import {
  SfoxEnterMicroDeposits,
  SfoxExchangeData,
  SfoxTradeDetails
} from './Sfox'
import SignMessage from './SignMessage'
import TransactionReport from './TransactionReport'
import {
  ConfirmDisable2FA,
  SecondPassword,
  TwoStepGoogleAuthenticator,
  TwoStepSetup,
  TwoStepYubico
} from './Settings'
import { PairingCode, ShowXPub, UpgradeWallet, Welcome } from './Wallet'
import {
  RequestXlm,
  SendXlm,
  ShowXlmPrivateKey,
  XlmAirdropWelcome,
  XlmCreateAccountLearn,
  XlmReserveLearn
} from './Xlm'

const Modals = props => (
  <div>
    <AddBtcWallet />
    <AutoDisconnection />
    <CoinifyDeleteBank />
    <CoinifyExchangeData />
    <CoinifyTradeDetails />
    <Confirm />
    <ConfirmDisable2FA />
    <DeleteAddressLabel />
    <EditTxDescription />
    <ExchangeDetails />
    <ExchangeResults />
    <IdentityVerification />
    <ImportBtcAddress />
    <LockboxAppInstall />
    <LockboxFirmware />
    <LockboxSetup />
    <MobileNumberChange />
    <MobileNumberVerify />
    <MobileLogin />
    <Onfido />
    <PairingCode />
    <PromptInput />
    <PromptLockbox />
    <QRCode />
    <RequestBch />
    <RequestBtc />
    <RequestEth />
    <RequestXlm />
    <SecondPassword />
    <SendBch />
    <SendBtc />
    <SendEth />
    <SendXlm />
    <ShowBtcPrivateKey />
    <ShowEthPrivateKey />
    <ShowXlmPrivateKey />
    <ShowUsedAddresses />
    <SignMessage />
    <ShowXPub />
    <SfoxExchangeData />
    <SfoxTradeDetails />
    <SfoxEnterMicroDeposits />
    <TransactionReport />
    <TransferEth />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeAddressLabels />
    <UpgradeWallet />
    <UserExists />
    <Welcome />
    <XlmCreateAccountLearn />
    <XlmReserveLearn />
    <XlmAirdropWelcome />
  </div>
)

export default Modals
