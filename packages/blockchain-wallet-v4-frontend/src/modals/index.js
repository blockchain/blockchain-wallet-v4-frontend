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
  CoinifyUpgrade,
  LinkFromPitAccount,
  LinkToPitAccount,
  SwapGetStarted,
  UpgradeForAirdrop,
  WalletTour
} from './Onboarding'
import {
  AutoDisconnection,
  ConfirmDisable2FA,
  SecondPassword,
  TwoStepGoogleAuthenticator,
  TwoStepSetup,
  TwoStepYubico
} from './Settings'
import {
  CoinifyBuyViaCard,
  CoinifyDeleteBank,
  CoinifyTradeDetails
} from './Coinify'
import { Confirm, PromptInput, Support } from './Generic'
import {
  DeleteAddressLabel,
  ShowUsedAddresses,
  UpgradeAddressLabels
} from './Addresses'
import { EditTxDescription, TransactionReport } from './Transactions'
import {
  EthAirdrop,
  ExchangeConfirm,
  ExchangeResults,
  IdentityVerification,
  KycDocResubmit,
  ShapeshiftTradeDetails,
  SunRiverLinkError,
  SwapUpgrade,
  UserExists
} from './Exchange'
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
import {
  SfoxEnterMicroDeposits,
  SfoxExchangeData,
  SfoxTradeDetails
} from './Sfox'
import BitPayExpired from './BitPayExpired'
import Onfido from './Onfido'
import QRCode from './QRCode'
import SignMessage from './SignMessage'

const Modals = () => (
  <div>
    <AddBtcWallet />
    <AirdropClaim />
    <AirdropSuccess />
    <BitPayExpired />
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
    <UpgradeWallet disableOutsideClose />
    <UserExists />
    <WalletTour />
    <XlmCreateAccountLearn />
    <XlmReserveLearn />
    <SunRiverWelcome disableOutsideClose />
    <VerifyMessage />
  </div>
)

export default Modals
