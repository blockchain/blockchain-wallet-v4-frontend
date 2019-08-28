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
import {
  CoinifyBuyViaCard,
  CoinifyDeleteBank,
  CoinifyTradeDetails
} from './Coinify'
import {
  PaxWelcome,
  RequestEth,
  SendEth,
  ShowEthPrivateKey,
  TransferEth
} from './Eth'
import {
  EthAirdrop,
  ExchangeConfirm,
  ExchangeResults,
  KycDocResubmit,
  IdentityVerification,
  ShapeshiftTradeDetails,
  SunRiverLinkError,
  SwapUpgrade,
  UserExists
} from './Exchange'
import { Confirm, PromptInput, Support } from './Generic'
import {
  LockboxAppManager,
  LockboxFirmware,
  LockboxSetup,
  LockboxConnectionPrompt,
  LockboxShowXPubs
} from './Lockbox'
import { MobileNumberChange, MobileNumberVerify } from './Mobile'
import {
  AirdropClaim,
  AirdropSuccess,
  CoinifyUpgrade,
  LinkFromPitAccount,
  LinkToPitAccount,
  SwapGetStarted,
  UpgradeForAirdrop,
  Welcome
} from './Onboarding'
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
import { PairingCode, ShowXPub, UpgradeWallet } from './Wallet'
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
    <AirdropClaim />
    <AirdropSuccess />
    <AutoDisconnection />
    <CoinifyBuyViaCard />
    <CoinifyDeleteBank />
    <CoinifyTradeDetails />
    <CoinifyUpgrade />
    <Confirm />
    <ConfirmDisable2FA />
    <DeleteAddressLabel />
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
    <LinkFromPitAccount disableOutsideClose />
    <LinkToPitAccount disableOutsideClose />
    <MobileNumberChange />
    <MobileNumberVerify />
    <Onfido />
    <PairingCode />
    <PaxWelcome />
    <PromptInput />
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
    <ShapeshiftTradeDetails />
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
    <Support />
    <SwapGetStarted />
    <SwapUpgrade />
    <TransactionReport />
    <TransferEth />
    <TwoStepGoogleAuthenticator />
    <TwoStepSetup />
    <TwoStepYubico />
    <UpgradeAddressLabels />
    <UpgradeForAirdrop />
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
