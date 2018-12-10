import React from 'react'

import {
  DeleteAddressLabel,
  ShowUsedAddresses,
  UpgradeAddressLabels
} from './Addresses'
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
import { RequestEth, SendEth, ShowEthPrivateKey, TransferEth } from './Eth'
import {
  ExchangeDetails,
  ExchangeResults,
  IdentityVerification,
  SwapGetStarted,
  UserExists,
  SunRiverLinkError
} from './Exchange'
import { Confirm, PromptInput } from './Generic'
import {
  LockboxAppManager,
  LockboxFirmware,
  LockboxSetup,
  PromptLockbox,
  ShowLockboxXPubs
} from './Lockbox'
import { MobileLogin, MobileNumberChange, MobileNumberVerify } from './Mobile'
import Onfido from './Onfido'
import QRCode from './QRCode'
import {
  SfoxEnterMicroDeposits,
  SfoxExchangeData,
  SfoxTradeDetails
} from './Sfox'
import SignMessage from './SignMessage'
import { EditTxDescription, TransactionReport } from './Transactions'
import {
  AutoDisconnection,
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
  SunRiverWelcome,
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
    <LockboxAppManager disableOutsideClose />
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
    <ShowLockboxXPubs />
    <SfoxExchangeData />
    <SfoxTradeDetails />
    <SfoxEnterMicroDeposits />
    <SunRiverLinkError />
    <SwapGetStarted />
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
    <SunRiverWelcome disableOutsideClose />
  </div>
)

export default Modals
