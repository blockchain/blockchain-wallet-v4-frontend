import React from 'react'

import { ModalName } from 'data/types'

// ADDRESSES
const DeleteAddressLabel = React.lazy(() => import('./Addresses/DeleteAddressLabel'))
const ShowUsedAddresses = React.lazy(() => import('./Addresses/ShowUsedAddresses'))
const UpgradeAddressLabels = React.lazy(() => import('./Addresses/UpgradeAddressLabels'))

// BITPAY
const BitpayInformational = React.lazy(() => import('./BitPay/Informational'))
const BitpayInvoiceExpired = React.lazy(() => import('./BitPay/InvoiceExpired'))

// BTC
const AddBtcWallet = React.lazy(() => import('./Btc/AddBtcWallet'))
const ImportBtcAddress = React.lazy(() => import('./Btc/ImportBtcAddress'))
const SendBtc = React.lazy(() => import('./Btc/SendBtc'))
const ShowBtcPrivateKey = React.lazy(() => import('./Btc/ShowBtcPrivateKey'))
const VerifyMessage = React.lazy(() => import('./Btc/VerifyMessage'))

// BCH
const SendBch = React.lazy(() => import('./Bch/SendBch'))

// Debit Card
const OrderCard = React.lazy(() => import('./DebitCard/OrderCard'))
const TerminateCard = React.lazy(() => import('./DebitCard/TerminateCard'))
const TransactionDetail = React.lazy(() => import('./DebitCard/TransactionDetail'))
const FundsList = React.lazy(() => import('./DebitCard/FundsList'))
const CustomizableConfirm = React.lazy(() => import('./CustomizableConfirm'))
const TransactionList = React.lazy(() => import('./DebitCard/TransactionList'))

// DEX
const DexTokenAllowance = React.lazy(() => import('./Dex/TokenAllowance'))
const DexSwapSettings = React.lazy(() => import('./Dex/SwapSettings'))
const DexSelectToken = React.lazy(() => import('./Dex/SelectToken'))

// Earn Compare
const EarnCompare = React.lazy(() => import('./EarnCompare'))

// ETH
const SendEth = React.lazy(() => import('./Eth/SendEth'))
const TransferEth = React.lazy(() => import('./Eth/TransferEth'))
const EthWalletBalances = React.lazy(() => import('./Eth/EthWalletBalances'))

// XLM
const SendXlm = React.lazy(() => import('./Xlm/SendXlm'))
const XlmCreateAccountLearn = React.lazy(() => import('./Xlm/XlmCreateAccountLearn'))
const XlmReserveLearn = React.lazy(() => import('./Xlm/XlmReserveLearn'))

// CRYPTO
const RequestCrypto = React.lazy(() => import('./RequestCrypto'))
const SendCrypto = React.lazy(() => import('./SendCrypto'))
const RecommendedImportedSweep = React.lazy(() => import('./Wallet/RecommendedSweep'))

// NFTS
const NftOrder = React.lazy(() => import('./Nfts/NftOrder'))
const GetFeatured = React.lazy(() => import('./Nfts/components/GetFeatured'))

// EARN
const Interest = React.lazy(() => import('./Earn/Interest'))
const Staking = React.lazy(() => import('./Earn/Staking'))
const ActiveRewards = React.lazy(() => import('./Earn/ActiveRewards'))
const InterestUploadDocuments = React.lazy(() => import('./InterestUploadDocuments'))

// GENERIC
const Confirm = React.lazy(() => import('./Generic/Confirm'))
const PromptInput = React.lazy(() => import('./Generic/PromptInput'))
const Support = React.lazy(() => import('./Generic/Support'))

// ONBOARDING
const AirdropClaim = React.lazy(() => import('./Onboarding/AirdropClaim'))
const AirdropSuccess = React.lazy(() => import('./Onboarding/AirdropSuccess'))
const CowboysPromo = React.lazy(() => import('./Onboarding/CowboysPromo'))
const LinkFromExchangeAccount = React.lazy(() => import('./Onboarding/LinkFromExchangeAccount'))
const LinkToExchangeAccount = React.lazy(() => import('./Onboarding/LinkToExchangeAccount'))
const IdentityVerification = React.lazy(() => import('./Onboarding/KycVerification'))
const KycDocResubmit = React.lazy(() => import('./Onboarding/KycDocResubmit'))
const KycTierUpgrade = React.lazy(() => import('./Onboarding/KycTierUpgrade'))
const NabuUserConflictRedirect = React.lazy(() => import('./Onboarding/NabuUserConflictRedirect'))
const UpgradeForAirdrop = React.lazy(() => import('./Onboarding/UpgradeForAirdrop'))
const Welcome = React.lazy(() => import('./Onboarding/Welcome'))
const UpgradeNowSilver = React.lazy(() => import('./Onboarding/UpgradeNowSilver'))
const VerifyNotice = React.lazy(() => import('./Onboarding/VerifyNotice'))
const SanctionsInfo = React.lazy(() => import('./Onboarding/SanctionsInfo'))
const EarnOnboarding = React.lazy(() => import('./Onboarding/Earn'))
// SOLO onboarding
const UnsupportedRegion = React.lazy(() => import('./Onboarding/UnsupportedRegion'))
const KycConsentScreen = React.lazy(() => import('./Onboarding/KycVerification/ConsentScreen'))
// FRICTIONS
const SelfClassification = React.lazy(() => import('./Onboarding/FinProms/SelfClassification'))
const SelfAssessment = React.lazy(() => import('./Onboarding/FinProms/SelfAssessment'))

// MOBILE
const MobileNumberChange = React.lazy(() => import('./Mobile/MobileNumberChange'))
const MobileNumberAdd = React.lazy(() => import('./Mobile/MobileNumberAdd'))
const MobileNumberVerify = React.lazy(() => import('./Mobile/MobileNumberVerify'))

const MobileNav = React.lazy(() => import('./MobileNav'))

// SETTINGS
const AutoDisconnection = React.lazy(() => import('./Settings/AutoDisconnection'))
const ConfirmDisable2FA = React.lazy(() => import('./Settings/ConfirmDisable2FA'))
const RecoveryPhrase = React.lazy(() => import('./Settings/RecoveryPhrase'))
const SecondPassword = React.lazy(() => import('./Settings/SecondPassword'))
const TradingLimits = React.lazy(() => import('./Settings/TradingLimits'))
const UpgradeNow = React.lazy(() => import('./Settings/UpgradeNow'))
const TwoStepGoogleAuthenticator = React.lazy(() => import('./Settings/TwoStepGoogleAuthenticator'))
const TwoStepSetup = React.lazy(() => import('./Settings/TwoStepSetup'))
const TwoStepYubico = React.lazy(() => import('./Settings/TwoStepYubico'))

// TRANSACTIONS
const DownloadTransactions = React.lazy(() => import('./Transactions/DownloadTransactions'))
const EditTxDescription = React.lazy(() => import('./Transactions/EditDescription'))

// WALLET
const PairingCode = React.lazy(() => import('./Wallet/PairingCode'))
const ShowXPub = React.lazy(() => import('./Wallet/ShowXPub'))
const InterestPromo = React.lazy(() => import('./Wallet/InterestPromo'))
const ResetAccountFailed = React.lazy(() => import('./Wallet/ResetAccountFailed'))

// SOLO
const FundRecovery = React.lazy(() => import('./FundRecovery'))
const QRCode = React.lazy(() => import('./QRCode'))
const SkipTwoFAVerificationRecovery = React.lazy(
  () => import('./Wallet/SkipTwoFAVerificationRecovery')
)
const SignMessage = React.lazy(() => import('./SignMessage'))
const BuySell = React.lazy(() => import('./BuySell'))
const Swap = React.lazy(() => import('./Swap'))
const Trade = React.lazy(() => import('./Trade'))
const RecurringBuys = React.lazy(() => import('./RecurringBuys'))
const ReferralLanding = React.lazy(() => import('./ReferralLandingFlyout'))
const CompleteProfile = React.lazy(() => import('./Onboarding/CompleteProfile'))
const TermsAndConditions = React.lazy(() => import('./TermsAndConditions'))
const ViewPrivateKeyWalletFlyout = React.lazy(() => import('./ViewPrivateKeyWalletFlyout'))
const ViewTradingAccountFlyout = React.lazy(() => import('./ViewTradingAccountFlyout'))
const ViewInterestAccountFlyout = React.lazy(() => import('./ViewInterestAccountFlyout'))
const ViewUsPatrioticActFlyout = React.lazy(() => import('./ViewUsPatrioticActFlyout'))

// BROKERAGE
const BankDetails = React.lazy(() => import('./Brokerage/Banks/BankDetails'))
const RemoveBank = React.lazy(() => import('./Brokerage/Banks/RemoveBank'))
const AddBankPlaid = React.lazy(() => import('./Brokerage/Banks/AddBankPlaid'))
const AddBankYapily = React.lazy(() => import('./Brokerage/Banks/AddBankYapily'))
const AddBankYodlee = React.lazy(() => import('./Brokerage/Banks/AddBankYodlee'))
const Deposit = React.lazy(() => import('./Brokerage/Banks/Deposit'))
const Withdraw = React.lazy(() => import('./Brokerage/Banks/Withdraw'))
const SelectAddBank = React.lazy(() => import('./Brokerage/Banks/SelectAddBank'))

// TAX CENTER
const GenerateReport = React.lazy(() => import('./TaxCenter/GenerateReport'))

// SOFI
const SofiWelcome = React.lazy(() => import('./Sofi/Welcome'))
const SofiMigratedBalances = React.lazy(() => import('./Sofi/MigratedBalances'))
const SofiVerifyID = React.lazy(() => import('./Sofi/Verify'))

export const CLOSABLE_MODALS_DICTIONARY = {
  [ModalName.ACTIVE_REWARDS_MODAL]: ActiveRewards,
  [ModalName.SIMPLE_BUY_MODAL]: BuySell,
  [ModalName.ADD_BANK_PLAID_MODAL]: AddBankPlaid,
  [ModalName.ADD_BANK_YAPILY_MODAL]: AddBankYapily,
  [ModalName.ADD_BANK_YODLEE_MODAL]: AddBankYodlee,
  [ModalName.ADD_BTC_WALLET_MODAL]: AddBtcWallet,
  [ModalName.AIRDROP_CLAIM_MODAL]: AirdropClaim,
  [ModalName.AIRDROP_SUCCESS_MODAL]: AirdropSuccess,
  [ModalName.AUTO_DISCONNECTION_MODAL]: AutoDisconnection,
  [ModalName.BANK_DETAILS_MODAL]: BankDetails,
  [ModalName.BITPAY_INFORMATIONAL_MODAL]: BitpayInformational,
  [ModalName.BITPAY_INVOICE_EXPIRED_MODAL]: BitpayInvoiceExpired,
  [ModalName.CONFIRMATION_MODAL]: Confirm,
  [ModalName.CONFIRM_DISABLE_2FA]: ConfirmDisable2FA,
  [ModalName.CUSTOMIZABLE_CONFIRM_MODAL]: CustomizableConfirm,
  [ModalName.DELETE_ADDRESS_LABEL_MODAL]: DeleteAddressLabel,
  [ModalName.BANK_DEPOSIT_MODAL]: Deposit,
  [ModalName.DEX_SWAP_SETTINGS]: DexSwapSettings,
  [ModalName.DEX_TOKEN_ALLOWANCE]: DexTokenAllowance,
  [ModalName.DEX_TOKEN_SELECT]: DexSelectToken,
  [ModalName.TRANSACTION_REPORT_MODAL]: DownloadTransactions,
  [ModalName.EARN_COMPARE]: EarnCompare,
  [ModalName.EDIT_TX_DESCRIPTION_MODAL]: EditTxDescription,
  [ModalName.FUNDS_LIST]: FundsList,
  [ModalName.FUND_RECOVERY_MODAL]: FundRecovery,
  [ModalName.GET_FEATURED]: GetFeatured,
  [ModalName.IMPORT_BTC_ADDRESS_MODAL]: ImportBtcAddress,
  [ModalName.INTEREST_MODAL]: Interest,
  [ModalName.MOBILE_NUMBER_CHANGE_MODAL]: MobileNumberChange,
  [ModalName.MOBILE_NUMBER_ADD_MODAL]: MobileNumberAdd,
  [ModalName.MOBILE_NUMBER_VERIFY_MODAL]: MobileNumberVerify,
  [ModalName.NABU_USER_CONFLICT_REDIRECT]: NabuUserConflictRedirect,
  [ModalName.ORDER_MY_CARD_MODAL]: OrderCard,
  [ModalName.PAIRING_CODE_MODAL]: PairingCode,
  [ModalName.PROMPT_INPUT_MODAL]: PromptInput,
  [ModalName.QR_CODE_MODAL]: QRCode,
  [ModalName.RECOVERY_PHRASE_MODAL]: RecoveryPhrase,
  [ModalName.REMOVE_BANK_MODAL]: RemoveBank,
  [ModalName.RECOMMENDED_IMPORTED_SWEEP]: RecommendedImportedSweep,
  [ModalName.RECURRING_BUYS_MODAL]: RecurringBuys,
  [ModalName.REFERRAL_LANDING_MODAL]: ReferralLanding,
  [ModalName.INTEREST_UPLOAD_DOCUMENT_MODAL]: InterestUploadDocuments,
  [ModalName.REQUEST_CRYPTO_MODAL]: RequestCrypto,
  [ModalName.SEND_CRYPTO_MODAL]: SendCrypto,
  [ModalName.SKIP_TWOFA_CONFIRMATION_WARNING]: SkipTwoFAVerificationRecovery,
  [ModalName.STAKING_MODAL]: Staking,
  [ModalName.RESET_ACCOUNT_FAILED]: ResetAccountFailed,
  [ModalName.SECOND_PASSWORD_MODAL]: SecondPassword,
  [ModalName.SEND_BCH_MODAL]: SendBch,
  [ModalName.SEND_BTC_MODAL]: SendBtc,
  [ModalName.SEND_ETH_MODAL]: SendEth,
  [ModalName.SEND_XLM_MODAL]: SendXlm,
  [ModalName.SHOW_BTC_PRIVATE_KEY_MODAL]: ShowBtcPrivateKey,
  [ModalName.SHOW_USED_ADDRESS_MODAL]: ShowUsedAddresses,
  [ModalName.SHOW_XPUB_MODAL]: ShowXPub,
  [ModalName.SIGN_MESSAGE_MODAL]: SignMessage,
  [ModalName.SOFI_BLOCKCHAIN_WELCOME]: SofiWelcome,
  [ModalName.SOFI_MIGRATED_BALANCES]: SofiMigratedBalances,
  [ModalName.SOFI_VERIFY_ID]: SofiVerifyID,
  [ModalName.SUPPORT_MODAL]: Support,
  [ModalName.SWAP_MODAL]: Swap,
  [ModalName.TERMINATE_CARD]: TerminateCard,
  [ModalName.TRANSACTION_DETAIL_MODAL]: TransactionDetail,
  [ModalName.TRANSACTION_LIST_MODAL]: TransactionList,
  [ModalName.TRADE_MODAL]: Trade,
  [ModalName.TRANSFER_ETH_MODAL]: TransferEth,
  [ModalName.TRADING_LIMITS_MODAL]: TradingLimits,
  [ModalName.UPGRADE_NOW_MODAL]: UpgradeNow,
  [ModalName.TWO_STEP_GOOGLE_AUTH_MODAL]: TwoStepGoogleAuthenticator,
  [ModalName.TWO_STEP_SETUP_MODAL]: TwoStepSetup,
  [ModalName.TWO_STEP_YUBICO_MODAL]: TwoStepYubico,
  [ModalName.UPGRADE_ADDRESS_LABELS_MODAL]: UpgradeAddressLabels,
  [ModalName.UPGRADE_FOR_AIRDROP_MODAL]: UpgradeForAirdrop,
  [ModalName.INTEREST_PROMO_MODAL]: InterestPromo,
  [ModalName.VERIFY_MESSAGE_MODAL]: VerifyMessage,
  [ModalName.ETH_WALLET_BALANCES]: EthWalletBalances,
  [ModalName.WELCOME_MODAL]: Welcome,
  [ModalName.UPGRADE_NOW_SILVER_MODAL]: UpgradeNowSilver,
  [ModalName.SANCTIONS_INFO_MODAL]: SanctionsInfo,
  [ModalName.UNSUPPORTED_REGION]: UnsupportedRegion,
  [ModalName.EARN_ONBOARDING]: EarnOnboarding,
  [ModalName.CUSTODY_WITHDRAW_MODAL]: Withdraw,
  [ModalName.COMPLETE_USER_PROFILE]: CompleteProfile,
  [ModalName.SEND_XLM_CREATE_ACCOUNT_LEARN_MODAL]: XlmCreateAccountLearn,
  [ModalName.SEND_XLM_RESERVE_LEARN_MODAL]: XlmReserveLearn,
  [ModalName.MOBILE_NAV]: MobileNav,
  [ModalName.KYC_MODAL]: IdentityVerification,
  [ModalName.KYC_RESUBMIT_MODAL]: KycDocResubmit,
  [ModalName.KYC_TIER_UPGRADE_MODAL]: KycTierUpgrade,
  [ModalName.GENERATE_REPORT_MODAL]: GenerateReport,
  [ModalName.KYC_CONSENT_SCREEN]: KycConsentScreen,
  [ModalName.VIEW_PRIVATE_KEY_WALLET]: ViewPrivateKeyWalletFlyout,
  [ModalName.VIEW_INTEREST_ACCOUNT]: ViewInterestAccountFlyout,
  [ModalName.VIEW_TRADING_ACCOUNT]: ViewTradingAccountFlyout,
  [ModalName.US_PATRIOTIC_ACT]: ViewUsPatrioticActFlyout,
  [ModalName.SELECT_ADD_BANK_TYPE]: SelectAddBank,
  [ModalName.SELF_CLASSIFICATION]: SelfClassification,
  [ModalName.SELF_ASSESSMENT]: SelfAssessment
}

// This require the disableOutsideClose prop
export const NON_CLOSABLE_MODALS_DICTIONARY = {
  [ModalName.COWBOYS_PROMO]: CowboysPromo,
  [ModalName.LINK_FROM_EXCHANGE_ACCOUNT_MODAL]: LinkFromExchangeAccount,
  [ModalName.LINK_TO_EXCHANGE_ACCOUNT_MODAL]: LinkToExchangeAccount,
  [ModalName.TERMS_AND_CONDITIONS_MODAL]: TermsAndConditions,
  [ModalName.VERIFY_NOTICE_MODAL]: VerifyNotice,
  [ModalName.NFT_ORDER]: NftOrder
}
