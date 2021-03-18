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

// BITPAY
const BitpayInformational = React.lazy(() => import('./BitPay/Informational'))
const BitpayInvoiceExpired = React.lazy(() => import('./BitPay/InvoiceExpired'))

// COINS
// BTC
const AddBtcWallet = React.lazy(() => import('./Btc/AddBtcWallet'))
const ImportBtcAddress = React.lazy(() => import('./Btc/ImportBtcAddress'))
const SendBtc = React.lazy(() => import('./Btc/SendBtc'))
const ShowBtcPrivateKey = React.lazy(() => import('./Btc/ShowBtcPrivateKey'))
const VerifyMessage = React.lazy(() => import('./Btc/VerifyMessage'))

// BCH
const SendBch = React.lazy(() => import('./Bch/SendBch'))

// ETH
const SendEth = React.lazy(() => import('./Eth/SendEth'))
const TransferEth = React.lazy(() => import('./Eth/TransferEth'))

// XLM
const SendXlm = React.lazy(() => import('./Xlm/SendXlm'))
const XlmCreateAccountLearn = React.lazy(() =>
  import('./Xlm/XlmCreateAccountLearn')
)
const XlmReserveLearn = React.lazy(() => import('./Xlm/XlmReserveLearn'))

// CRYPTO
const RequestCrypto = React.lazy(() => import('./RequestCrypto'))

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
const IdentityVerification = React.lazy(() =>
  import('./Onboarding/KycVerification')
)
const KycDocResubmit = React.lazy(() => import('./Onboarding/KycDocResubmit'))
const KycTierUpgrade = React.lazy(() => import('./Onboarding/KycTierUpgrade'))
const SwapGetStarted = React.lazy(() => import('./Onboarding/SwapGetStarted'))
const UpgradeForAirdrop = React.lazy(() =>
  import('./Onboarding/UpgradeForAirdrop')
)
const Welcome = React.lazy(() => import('./Onboarding/Welcome'))

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
const TradingLimits = React.lazy(() => import('./Settings/TradingLimits'))
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
const InterestPromo = React.lazy(() => import('./Wallet/InterestPromo'))

// SOLO
const Borrow = React.lazy(() => import('./Borrow'))
const Interest = React.lazy(() => import('./Interest'))
const QRCode = React.lazy(() => import('./QRCode'))
const SignMessage = React.lazy(() => import('./SignMessage'))
const SimpleBuy = React.lazy(() => import('./SimpleBuy'))
const Swap = React.lazy(() => import('./Swap'))

// BROKERAGE
const BankDetails = React.lazy(() => import('./Brokerage/Banks/BankDetails'))
const RemoveBank = React.lazy(() => import('./Brokerage/Banks/RemoveBank'))
const AddBank = React.lazy(() => import('./Brokerage/Banks/AddBank'))
const Deposit = React.lazy(() => import('./Brokerage/Banks/Deposit'))
const Withdraw = React.lazy(() => import('./Brokerage/Banks/Withdraw'))

const Modals = () => (
  <Suspense fallback={null}>
    <div>
      <AddBank />
      <AddBtcWallet />
      <AirdropClaim />
      <AirdropSuccess />
      <AutoDisconnection />
      <BitpayInformational />
      <BitpayInvoiceExpired />
      <Borrow />
      <BankDetails />
      <Confirm />
      <ConfirmDisable2FA />
      <DeleteAddressLabel />
      <Deposit />
      <DownloadTransactions />
      <EditTxDescription />
      <IdentityVerification />
      <ImportBtcAddress />
      <Interest />
      <KycDocResubmit />
      <KycTierUpgrade />
      <LinkFromExchangeAccount disableOutsideClose />
      <LinkToExchangeAccount disableOutsideClose />
      <LockboxAppManager disableOutsideClose />
      <LockboxConnectionPrompt disableOutsideClose />
      <LockboxFirmware disableOutsideClose />
      <LockboxSetup disableOutsideClose />
      <LockboxShowXPubs />
      <MobileNumberChange />
      <MobileNumberVerify />
      <PairingCode />
      <PromptInput />
      <QRCode />
      <RecoveryPhrase />
      <RemoveBank />
      <RequestCrypto />
      <SecondPassword />
      <SendBch />
      <SendBtc />
      <SendEth />
      <SendXlm />
      <ShowBtcPrivateKey />
      <ShowUsedAddresses />
      <ShowXPub />
      <SignMessage />
      <SimpleBuy />
      <Support />
      <Swap />
      <SwapGetStarted />
      <TransferEth />
      <TradingLimits />
      <TwoStepGoogleAuthenticator />
      <TwoStepSetup />
      <TwoStepYubico />
      <UpgradeAddressLabels />
      <UpgradeForAirdrop />
      <UpgradeWallet />
      <InterestPromo />
      <VerifyMessage />
      <Welcome />
      <Withdraw />
      <XlmCreateAccountLearn />
      <XlmReserveLearn />
    </div>
  </Suspense>
)

export default Modals
