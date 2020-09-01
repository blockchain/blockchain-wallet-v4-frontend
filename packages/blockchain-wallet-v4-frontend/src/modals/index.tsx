import React, { Suspense } from 'react'

// ADDRESSES
const DeleteAddressLabel = React.lazy(() =>
  import('./Addresses/DeleteAddressLabel')
)
const ShowUsedAddresses = React.lazy(() =>
  import('./Addresses/ShowUsedAddresses')
)
const UpgradeAddressLabels = React.lazy(() =>
  import('./Addresses/UpgradeAddressLabels')
)

// COINS
// BTC
const AddBtcWallet = React.lazy(() => import('./Btc/AddBtcWallet'))
const ImportBtcAddress = React.lazy(() => import('./Btc/ImportBtcAddress'))
const RequestBtc = React.lazy(() => import('./Btc/RequestBtc'))
const SendBtc = React.lazy(() => import('./Btc/SendBtc'))
const ShowBtcPrivateKey = React.lazy(() => import('./Btc/ShowBtcPrivateKey'))
const VerifyMessage = React.lazy(() => import('./Btc/VerifyMessage'))

// BCH
const RequestBch = React.lazy(() => import('./Bch/RequestBch'))
const SendBch = React.lazy(() => import('./Bch/SendBch'))

// ETH
const PaxWelcome = React.lazy(() => import('./Eth/PaxWelcome'))
const RequestEth = React.lazy(() => import('./Eth/RequestEth'))
const SendEth = React.lazy(() => import('./Eth/SendEth'))
const TransferEth = React.lazy(() => import('./Eth/TransferEth'))

// XLM
const RequestXlm = React.lazy(() => import('./Xlm/RequestXlm'))
const SendXlm = React.lazy(() => import('./Xlm/SendXlm'))
const SunRiverWelcome = React.lazy(() => import('./Xlm/SunRiverWelcome'))
const XlmCreateAccountLearn = React.lazy(() =>
  import('./Xlm/XlmCreateAccountLearn')
)
const XlmReserveLearn = React.lazy(() => import('./Xlm/XlmReserveLearn'))

// BITPAY
const BitpayInformational = React.lazy(() => import('./BitPay/Informational'))
const BitpayInvoiceExpired = React.lazy(() => import('./BitPay/InvoiceExpired'))

// GENERIC
const Confirm = React.lazy(() => import('./Generic/Confirm'))
const PromptInput = React.lazy(() => import('./Generic/PromptInput'))
const Support = React.lazy(() => import('./Generic/Support'))

// ONBOARDING
const AirdropClaim = React.lazy(() => import('./Onboarding/AirdropClaim'))
const AirdropSuccess = React.lazy(() => import('./Onboarding/AirdropSuccess'))
const LinkFromExchangeAccount = React.lazy(() =>
  import('./Onboarding/LinkFromExchangeAccount')
)
const LinkToExchangeAccount = React.lazy(() =>
  import('./Onboarding/LinkToExchangeAccount')
)
const SwapGetStarted = React.lazy(() => import('./Onboarding/SwapGetStarted'))
const UpgradeForAirdrop = React.lazy(() =>
  import('./Onboarding/UpgradeForAirdrop')
)
const Welcome = React.lazy(() => import('./Onboarding/Welcome'))

// EXCHANGE
const AirdropError = React.lazy(() => import('./Exchange/AirdropError'))
const EthAirdrop = React.lazy(() => import('./Exchange/EthAirdrop'))
const ExchangeConfirm = React.lazy(() => import('./Exchange/ExchangeConfirm'))
const ExchangeResults = React.lazy(() => import('./Exchange/ExchangeResults'))
const IdentityVerification = React.lazy(() =>
  import('./Exchange/IdentityVerification')
)
const KycDocResubmit = React.lazy(() => import('./Exchange/KycDocResubmit'))
const SwapUpgrade = React.lazy(() => import('./Exchange/SwapUpgrade'))
const UserExists = React.lazy(() => import('./Exchange/UserExists'))

// LOCKBOX
const LockboxAppManager = React.lazy(() =>
  import('./Lockbox/LockboxAppManager')
)
const LockboxConnectionPrompt = React.lazy(() =>
  import('./Lockbox/LockboxConnectionPrompt')
)
const LockboxFirmware = React.lazy(() => import('./Lockbox/LockboxFirmware'))
const LockboxSetup = React.lazy(() => import('./Lockbox/LockboxSetup'))
const LockboxShowXPubs = React.lazy(() => import('./Lockbox/LockboxShowXPubs'))

// MOBILE
const MobileNumberChange = React.lazy(() =>
  import('./Mobile/MobileNumberChange')
)
const MobileNumberVerify = React.lazy(() =>
  import('./Mobile/MobileNumberVerify')
)

// SETTINGS
const AutoDisconnection = React.lazy(() =>
  import('./Settings/AutoDisconnection')
)
const ConfirmDisable2FA = React.lazy(() =>
  import('./Settings/ConfirmDisable2FA')
)
const RecoveryPhrase = React.lazy(() => import('./Settings/RecoveryPhrase'))
const SecondPassword = React.lazy(() => import('./Settings/SecondPassword'))
const TwoStepGoogleAuthenticator = React.lazy(() =>
  import('./Settings/TwoStepGoogleAuthenticator')
)
const TwoStepSetup = React.lazy(() => import('./Settings/TwoStepSetup'))
const TwoStepYubico = React.lazy(() => import('./Settings/TwoStepYubico'))

// TRANSACTIONS
const DownloadTransactions = React.lazy(() =>
  import('./Transactions/DownloadTransactions')
)
const EditTxDescription = React.lazy(() =>
  import('./Transactions/EditDescription')
)

// WALLET
const PairingCode = React.lazy(() => import('./Wallet/PairingCode'))
const ShowXPub = React.lazy(() => import('./Wallet/ShowXPub'))
const UpgradeWallet = React.lazy(() => import('./Wallet/UpgradeWallet'))

// SOLO
const Borrow = React.lazy(() => import('./Borrow'))
const Interest = React.lazy(() => import('./Interest'))
const Onfido = React.lazy(() => import('./Onfido'))
const QRCode = React.lazy(() => import('./QRCode'))
const SignMessage = React.lazy(() => import('./SignMessage'))
const SimpleBuy = React.lazy(() => import('./SimpleBuy'))
const WhatsNew = React.lazy(() => import('./WhatsNew'))
const Withdraw = React.lazy(() => import('./Withdraw'))

const Modals = () => (
  <Suspense fallback={null}>
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
      <Interest />
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
      <ShowBtcPrivateKey />
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
      <Withdraw />
      <WhatsNew />
    </div>
  </Suspense>
)

export default Modals
