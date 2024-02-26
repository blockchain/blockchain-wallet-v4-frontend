import { AccountRecoveryActions, AccountRecoveryEvents } from './accountRecovery'
import { BuyActions, BuyEvents } from './buy'
import { CoinViewActions, CoinViewEvents } from './coinView'
import { CowboysPromoActions, CowboysPromoEvents } from './cowboysPromo'
import {
  DepositWithdrawalClientEventActions,
  DepositWithdrawalClientEvents,
  DepositWithdrawalClientProperties
} from './depositWithdrawalClient'
import { DexActions, DexEvents } from './dexEvents'
import { ClientErrorActions, ClientErrorEvents } from './errors'
import { ExchangePromoActions, ExchangePromoEvents } from './exchangePromo'
import {
  InterestClientActions,
  InterestClientEvents,
  InterestClientProperties
} from './interestClient'
import { LoginActions, LoginEvents } from './login'
import { MiscActions, MiscEvents } from './misc'
import { NftsEvents, NftsTrackEventActions } from './nfts'
import {
  OnboardingAndVerificationActions,
  OnboardingAndVerificationAnalyticsProperties,
  OnboardingAndVerificationEvents
} from './onboardingAndVerification'
import { PlaidClientActions, PlaidClientEvents } from './plaid'
import { RecommendedSweepActions, RecommendedSweepEvents } from './recommendedimportsweep'
import { SellActions, SellEvents } from './sell'
import { SendCryptoActions, SendCryptoEvents } from './sendCrypto'
import { SofiActions, SofiEvents } from './sofi'
import { SpinnerActions, SpinnerEvents } from './spinner'
import { SwapActions, SwapEvents } from './swap'
import { TaxCenterActions, TaxCenterEvents } from './taxCenter'
import {
  ViewAndClickActions,
  ViewAndClickAnalyticsProperties,
  ViewAndClickEvents
} from './viewAndClick'
import { WalletEarnActions, WalletEarnEvents } from './walletEarnClientEvents'

const TRACK_EVENT = 'trackEvent'

type AnalyticsKey =
  | AccountRecoveryEvents
  | BuyEvents
  | ClientErrorEvents
  | CoinViewEvents
  | CowboysPromoEvents
  | DepositWithdrawalClientEvents
  | DexEvents
  | ExchangePromoEvents
  | InterestClientEvents
  | LoginEvents
  | MiscEvents
  | NftsEvents
  | OnboardingAndVerificationEvents
  | PlaidClientEvents
  | RecommendedSweepEvents
  | SellEvents
  | SendCryptoEvents
  | SofiEvents
  | SpinnerEvents
  | SwapEvents
  | TaxCenterEvents
  | ViewAndClickEvents
  | WalletEarnEvents

const Analytics = {
  ...AccountRecoveryEvents,
  ...BuyEvents,
  ...ClientErrorEvents,
  ...CoinViewEvents,
  ...CowboysPromoEvents,
  ...DepositWithdrawalClientEvents,
  ...DexEvents,
  ...ExchangePromoEvents,
  ...InterestClientEvents,
  ...LoginEvents,
  ...MiscEvents,
  ...NftsEvents,
  ...OnboardingAndVerificationEvents,
  ...PlaidClientEvents,
  ...RecommendedSweepEvents,
  ...SellEvents,
  ...SendCryptoEvents,
  ...SofiEvents,
  ...SpinnerEvents,
  ...SwapEvents,
  ...TaxCenterEvents,
  ...ViewAndClickEvents,
  ...WalletEarnEvents
}

// event properties
type AnalyticsProperties =
  | DepositWithdrawalClientProperties
  | InterestClientProperties
  | OnboardingAndVerificationAnalyticsProperties
  | ViewAndClickAnalyticsProperties

// event actions
type TrackEventAction =
  | AccountRecoveryActions
  | BuyActions
  | ClientErrorActions
  | CowboysPromoActions
  | DepositWithdrawalClientEventActions
  | DexActions
  | ExchangePromoActions
  | InterestClientActions
  | LoginActions
  | MiscActions
  | NftsTrackEventActions
  | OnboardingAndVerificationActions
  | RecommendedSweepActions
  | PlaidClientActions
  | SellActions
  | SendCryptoActions
  | SofiActions
  | SpinnerActions
  | SwapActions
  | TaxCenterActions
  | CoinViewActions
  | ViewAndClickActions
  | WalletEarnActions

type AnalyticsTraits = {
  country?: string
  country_state?: string
  email?: string
  nabuId: string
  tier?: number
}

type AnalyticsValue = {
  properties: AnalyticsProperties
  traits: AnalyticsTraits
}

type RawEvent = {
  key: AnalyticsKey
  payload: AnalyticsValue
}

export { Analytics, AnalyticsKey, AnalyticsValue, RawEvent, TRACK_EVENT, TrackEventAction }
