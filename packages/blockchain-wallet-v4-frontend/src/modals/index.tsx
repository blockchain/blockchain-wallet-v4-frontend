import React, { Suspense } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { selectors } from 'data'
import { ModalName } from 'data/types'

import CustomizableConfirm from './CustomizableConfirm'
// Do not lazy load this modal
import NewVersionAvailable from './Settings/NewVersionAvailable'

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
const OrderMyCard = React.lazy(() => import('./DebitCard/OrderMyCard'))
const TerminateCard = React.lazy(() => import('./DebitCard/TerminateCard'))
const TransactionDetail = React.lazy(() => import('./DebitCard/TransactionDetail'))
const FundsList = React.lazy(() => import('./DebitCard/FundsList'))

// DEX
const DexSwapSettings = React.lazy(() => import('./Dex/SwapSettings'))
const DexSelectToken = React.lazy(() => import('./Dex/SelectToken'))

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

// NFTS
const NftOrder = React.lazy(() => import('./Nfts/NftOrder'))
const GetFeatured = React.lazy(() => import('./Nfts/components/GetFeatured'))

// GENERIC
const Confirm = React.lazy(() => import('./Generic/Confirm'))
const PromptInput = React.lazy(() => import('./Generic/PromptInput'))
const Support = React.lazy(() => import('./Generic/Support'))

// ONBOARDING
const AirdropClaim = React.lazy(() => import('./Onboarding/AirdropClaim'))
const AirdropSuccess = React.lazy(() => import('./Onboarding/AirdropSuccess'))
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
const Interest = React.lazy(() => import('./Interest'))
const QRCode = React.lazy(() => import('./QRCode'))
const SignMessage = React.lazy(() => import('./SignMessage'))
const BuySell = React.lazy(() => import('./BuySell'))
const Swap = React.lazy(() => import('./Swap'))
const Trade = React.lazy(() => import('./Trade'))
const RecurringBuys = React.lazy(() => import('./RecurringBuys'))
const InterestUploadDocuments = React.lazy(() => import('./InterestUploadDocuments'))
const CompleteProfile = React.lazy(() => import('./Onboarding/CompleteProfile'))
const TermsAndConditions = React.lazy(() => import('./TermsAndConditions'))

// BROKERAGE
const BankDetails = React.lazy(() => import('./Brokerage/Banks/BankDetails'))
const RemoveBank = React.lazy(() => import('./Brokerage/Banks/RemoveBank'))
const AddBankYapily = React.lazy(() => import('./Brokerage/Banks/AddBankYapily'))
const AddBankYodlee = React.lazy(() => import('./Brokerage/Banks/AddBankYodlee'))
const Deposit = React.lazy(() => import('./Brokerage/Banks/Deposit'))
const Withdraw = React.lazy(() => import('./Brokerage/Banks/Withdraw'))

// TAX CENTER
const GenerateReport = React.lazy(() => import('./TaxCenter/GenerateReport'))

const Modals = (props: Props) => {
  return (
    <Suspense fallback={null}>
      <>
        {props.modals.find((modal) => modal.type === ModalName.ADD_BANK_YAPILY_MODAL) ? (
          <AddBankYapily />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.ADD_BANK_YODLEE_MODAL) ? (
          <AddBankYodlee />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.ADD_BTC_WALLET_MODAL) ? (
          <AddBtcWallet />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.AIRDROP_CLAIM_MODAL) ? (
          <AirdropClaim />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.AIRDROP_SUCCESS_MODAL) ? (
          <AirdropSuccess />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.AUTO_DISCONNECTION_MODAL) ? (
          <AutoDisconnection />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.BANK_DETAILS_MODAL) ? (
          <BankDetails />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.BITPAY_INFORMATIONAL_MODAL) ? (
          <BitpayInformational />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.BITPAY_INVOICE_EXPIRED_MODAL) ? (
          <BitpayInvoiceExpired />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.CONFIRMATION_MODAL) ? (
          <Confirm />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.CONFIRM_DISABLE_2FA) ? (
          <ConfirmDisable2FA />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.CUSTOMIZABLE_CONFIRM_MODAL) ? (
          <CustomizableConfirm />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.DELETE_ADDRESS_LABEL_MODAL) ? (
          <DeleteAddressLabel />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.BANK_DEPOSIT_MODAL) ? (
          <Deposit />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.DEX_SWAP_SETTINGS) ? (
          <DexSwapSettings />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.DEX_TOKEN_SELECT) ? (
          <DexSelectToken />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TRANSACTION_REPORT_MODAL) ? (
          <DownloadTransactions />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.EDIT_TX_DESCRIPTION_MODAL) ? (
          <EditTxDescription />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.FUNDS_LIST) ? <FundsList /> : null}
        {props.modals.find((modal) => modal.type === ModalName.FUND_RECOVERY_MODAL) ? (
          <FundRecovery />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.GET_FEATURED) ? (
          <GetFeatured />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.IMPORT_BTC_ADDRESS_MODAL) ? (
          <ImportBtcAddress />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.INTEREST_MODAL) ? (
          <Interest />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.LINK_FROM_EXCHANGE_ACCOUNT_MODAL) ? (
          <LinkFromExchangeAccount disableOutsideClose />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.LINK_TO_EXCHANGE_ACCOUNT_MODAL) ? (
          <LinkToExchangeAccount disableOutsideClose />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.MOBILE_NUMBER_CHANGE_MODAL) ? (
          <MobileNumberChange />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.MOBILE_NUMBER_ADD_MODAL) ? (
          <MobileNumberAdd />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.MOBILE_NUMBER_VERIFY_MODAL) ? (
          <MobileNumberVerify />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.NABU_USER_CONFLICT_REDIRECT) ? (
          <NabuUserConflictRedirect />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.ORDER_MY_CARD) ? (
          <OrderMyCard />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.PAIRING_CODE_MODAL) ? (
          <PairingCode />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.PROMPT_INPUT_MODAL) ? (
          <PromptInput />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.QR_CODE_MODAL) ? <QRCode /> : null}
        {props.modals.find((modal) => modal.type === ModalName.RECOVERY_PHRASE_MODAL) ? (
          <RecoveryPhrase />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.REMOVE_BANK_MODAL) ? (
          <RemoveBank />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.RECURRING_BUYS_MODAL) ? (
          <RecurringBuys />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.INTEREST_UPLOAD_DOCUMENT_MODAL) ? (
          <InterestUploadDocuments />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.REQUEST_CRYPTO_MODAL) ? (
          <RequestCrypto />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SEND_CRYPTO_MODAL) ? (
          <SendCrypto />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.RESET_ACCOUNT_FAILED) ? (
          <ResetAccountFailed />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SECOND_PASSWORD_MODAL) ? (
          <SecondPassword />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SEND_BCH_MODAL) ? <SendBch /> : null}
        {props.modals.find((modal) => modal.type === ModalName.SEND_BTC_MODAL) ? <SendBtc /> : null}
        {props.modals.find((modal) => modal.type === ModalName.SEND_ETH_MODAL) ? <SendEth /> : null}
        {props.modals.find((modal) => modal.type === ModalName.SEND_XLM_MODAL) ? <SendXlm /> : null}
        {props.modals.find((modal) => modal.type === ModalName.SHOW_BTC_PRIVATE_KEY_MODAL) ? (
          <ShowBtcPrivateKey />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SHOW_USED_ADDRESS_MODAL) ? (
          <ShowUsedAddresses />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SHOW_XPUB_MODAL) ? (
          <ShowXPub />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SIGN_MESSAGE_MODAL) ? (
          <SignMessage />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SIMPLE_BUY_MODAL) ? (
          <BuySell />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SUPPORT_MODAL) ? <Support /> : null}
        {props.modals.find((modal) => modal.type === ModalName.SWAP_MODAL) ? <Swap /> : null}
        {props.modals.find((modal) => modal.type === ModalName.TERMINATE_CARD) ? (
          <TerminateCard />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TRANSACTION_DETAIL) ? (
          <TransactionDetail />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TERMS_AND_CONDITIONS) ? (
          <TermsAndConditions disableOutsideClose />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.VERIFY_NOTICE) ? (
          <VerifyNotice disableOutsideClose />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TRADE_MODAL) ? <Trade /> : null}
        {props.modals.find((modal) => modal.type === ModalName.TRANSFER_ETH_MODAL) ? (
          <TransferEth />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TRADING_LIMITS_MODAL) ? (
          <TradingLimits />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.UPGRADE_NOW_MODAL) ? (
          <UpgradeNow />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TWO_STEP_GOOGLE_AUTH_MODAL) ? (
          <TwoStepGoogleAuthenticator />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TWO_STEP_SETUP_MODAL) ? (
          <TwoStepSetup />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.TWO_STEP_YUBICO_MODAL) ? (
          <TwoStepYubico />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.UPGRADE_ADDRESS_LABELS_MODAL) ? (
          <UpgradeAddressLabels />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.UPGRADE_FOR_AIRDROP_MODAL) ? (
          <UpgradeForAirdrop />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.INTEREST_PROMO_MODAL) ? (
          <InterestPromo />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.VERIFY_MESSAGE_MODAL) ? (
          <VerifyMessage />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.ETH_WALLET_BALANCES) ? (
          <EthWalletBalances />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.WELCOME_MODAL) ? <Welcome /> : null}
        {props.modals.find((modal) => modal.type === ModalName.UPGRADE_NOW_SILVER_MODAL) ? (
          <UpgradeNowSilver />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SANCTIONS_INFO_MODAL) ? (
          <SanctionsInfo />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.CUSTODY_WITHDRAW_MODAL) ? (
          <Withdraw />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.COMPLETE_USER_PROFILE) ? (
          <CompleteProfile />
        ) : null}
        {props.modals.find(
          (modal) => modal.type === ModalName.SEND_XLM_CREATE_ACCOUNT_LEARN_MODAL
        ) ? (
          <XlmCreateAccountLearn />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.SEND_XLM_RESERVE_LEARN_MODAL) ? (
          <XlmReserveLearn />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.MOBILE_NAV) ? <MobileNav /> : null}
        {props.modals.find((modal) => modal.type === ModalName.KYC_MODAL) ? (
          <IdentityVerification />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.KYC_RESUBMIT_MODAL) ? (
          <KycDocResubmit />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.KYC_TIER_UPGRADE_MODAL) ? (
          <KycTierUpgrade />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.GENERATE_REPORT_MODAL) ? (
          <GenerateReport />
        ) : null}
        {props.modals.find((modal) => modal.type === ModalName.NFT_ORDER) ? (
          <NftOrder disableOutsideClose />
        ) : null}
        {/* This should always be loaded */}
        <NewVersionAvailable disableOutsideClose />
      </>
    </Suspense>
  )
}

const mapStateToProps = (state) => ({
  modals: selectors.modals.getModals(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Modals)
