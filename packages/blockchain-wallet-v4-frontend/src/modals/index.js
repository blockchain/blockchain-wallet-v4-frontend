import React from 'react'

import {
  AddBtcWallet,
  ImportBtcAddress,
  RequestBtc,
  SendBtc,
  ShowBtcPrivateKey,
  VerifyMessage
} from './Btc'
import {
  AirdropClaim,
  AirdropSuccess,
  LinkFromExchangeAccount,
  LinkToExchangeAccount,
  SwapGetStarted,
  UpgradeForAirdrop,
  Welcome
} from './Onboarding'
import {
  AirdropError,
  EthAirdrop,
  ExchangeConfirm,
  ExchangeResults,
  IdentityVerification,
  KycDocResubmit,
  ShapeshiftTradeDetails,
  SwapUpgrade,
  UserExists
} from './Exchange'
import {
  AutoDisconnection,
  ConfirmDisable2FA,
  SecondPassword,
  TwoStepGoogleAuthenticator,
  TwoStepSetup,
  TwoStepYubico
} from './Settings'
import { BitpayInformational, BitpayInvoiceExpired } from './BitPay'
import { Confirm, PromptInput, Support } from './Generic'
import {
  DeleteAddressLabel,
  ShowUsedAddresses,
  UpgradeAddressLabels
} from './Addresses'
import { DownloadTransactions, EditTxDescription } from './Transactions'
import {
  LockboxAppManager,
  LockboxConnectionPrompt,
  LockboxFirmware,
  LockboxSetup,
  LockboxShowXPubs
} from './Lockbox'
import { MobileNumberChange, MobileNumberVerify } from './Mobile'
import { PairingCode, ShowXPub, UpgradeWallet } from './Wallet'
import {
  PaxWelcome,
  RequestEth,
  SendEth,
  ShowEthPrivateKey,
  TransferEth
} from './Eth'
import { RequestBch, SendBch } from './Bch'
import {
  RequestXlm,
  SendXlm,
  ShowXlmPrivateKey,
  SunRiverWelcome,
  XlmCreateAccountLearn,
  XlmReserveLearn
} from './Xlm'
import Borrow from './Borrow'
import Onfido from './Onfido'
import QRCode from './QRCode'
import RecoveryPhrase from './RecoveryPhrase'
import SignMessage from './SignMessage'
import SimpleBuy from './SimpleBuy'
import WhatsNew from './WhatsNew'

const Modals = () => (
  <div>
    <AddBtcWallet />
    <AirdropClaim />
    <AirdropSuccess />
    <BitpayInvoiceExpired />
    <BitpayInformational />
    <Borrow />
    <AutoDisconnection />
    <Confirm />
    <ConfirmDisable2FA />
    <DeleteAddressLabel />
    <DownloadTransactions />
    <EditTxDescription />
    <EthAirdrop />
    <ExchangeConfirm />
    <ExchangeResults />
    <KycDocResubmit />
    <IdentityVerification />
    <ImportBtcAddress />
    <LockboxAppManager disableOutsideClose />
    <LockboxConnectionPrompt disableOutsideClose />
    <LockboxFirmware disableOutsideClose />
    <LockboxSetup disableOutsideClose />
    <LockboxShowXPubs />
    <LinkFromExchangeAccount disableOutsideClose />
    <LinkToExchangeAccount disableOutsideClose />
    <MobileNumberChange />
    <MobileNumberVerify />
    <Onfido />
    <PairingCode />
    <PaxWelcome />
    <PromptInput />
    <QRCode />
    <RecoveryPhrase />
    <RequestBch />
    <RequestBtc />
    <RequestEth />
    <RequestXlm />
    <SecondPassword />
    <SendBch />
    <SendBtc />
    <SendEth />
    <SendXlm />
    <ShapeshiftTradeDetails />
    <ShowBtcPrivateKey />
    <ShowEthPrivateKey />
    <ShowXlmPrivateKey />
    <ShowUsedAddresses />
    <SignMessage />
    <ShowXPub />
    <AirdropError />
    <Support />
    <SwapGetStarted />
    <SwapUpgrade />
    <TransferEth />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeAddressLabels />
    <UpgradeForAirdrop />
    <UpgradeWallet />
    <UserExists />
    <XlmCreateAccountLearn />
    <XlmReserveLearn />
    <SimpleBuy />
    <SunRiverWelcome disableOutsideClose />
    <VerifyMessage />
    <Welcome />
    <WhatsNew />
  </div>
)

export default Modals
