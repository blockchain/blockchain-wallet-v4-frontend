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
  ShowBtcPrivateKey,
  VerifyMessage
} from './Btc'
import { SendBsv } from './Bsv'
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
  SwapUpgrade,
  UserExists,
  SunRiverLinkError
} from './Exchange'
import { Confirm, PromptInput } from './Generic'
import {
  LockboxAppManager,
  LockboxAuthenticityCheck,
  LockboxFirmware,
  LockboxSetup,
  LockboxConnectionPrompt,
  LockboxShowXPubs
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

const Modals = () => (
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
    <LockboxAuthenticityCheck disableOutsideClose />
    <LockboxAppManager disableOutsideClose />
    <LockboxConnectionPrompt disableOutsideClose />
    <LockboxFirmware disableOutsideClose />
    <LockboxSetup disableOutsideClose />
    <LockboxShowXPubs />
    <MobileNumberChange />
    <MobileNumberVerify />
    <MobileLogin />
    <Onfido />
    <PairingCode />
    <PromptInput />
    <QRCode />
    <RequestBch />
    <RequestBtc />
    <RequestEth />
    <RequestXlm />
    <SecondPassword />
    <SendBch />
    <SendBtc />
    <SendBsv />
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
    <SunRiverLinkError />
    <SwapGetStarted />
    <SwapUpgrade />
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
    <VerifyMessage />
  </div>
)

export default Modals
