import { AccountRecoveryActions, AccountRecoveryEvents } from './accountRecovery'
import { BuyActions, BuyEvents } from './buy'
import { CoinViewActions, CoinViewEvents } from './coinView'
import { CowboysPromoActions, CowboysPromoEvents } from './cowboysPromo'
import {
  AnalyticsProperties as DepositWithdrawalClientProperties,
  Events as DepositWithdrawalClientEvents,
  TrackEventAction as DepositWithdrawalClientEventAction
} from './depositWithdrawalClient'
import { Events as DexEvents, TrackEventAction as DexEventAction } from './dexEvents'
import {
  Events as ClientErrorEvents,
  TrackEventAction as ClientErrorTrackEventAction
} from './errors'
import { ExchangePromoActions, ExchangePromoEvents } from './exchangePromo'
import {
  AnalyticsProperties as InterestClientProperties,
  Events as InterestClientEvents,
  TrackEventAction as InterestClientTrackEventAction
} from './interestClient'
import { LoginActions, LoginEvents } from './login'
import { MiscActions, MiscEvents } from './misc'
import { Events as NftsEvents, TrackEventAction as NftsTrackEventAction } from './nfts'
import {
  AnalyticsProperties as OnboardingAndVerificationAnalyticsProperties,
  Events as OnboardingAndVerificationEvents,
  TrackEventAction as OnboardingAndVerificationTrackEventAction
} from './onboardingAndVerification'
import { PlaidClientactions, PlaidClientEvents } from './plaid'
import {
  Events as RecommendedSweepEvents,
  TrackEventAction as RecommendedSweepTrackEventAction
} from './recommendedimportsweep'
import { SellActions, SellEvents } from './sell'
import { SendCryptoActions, SendCryptoEvents } from './sendCrypto'
import { SofiActions, SofiEvents } from './sofi'
import { SpinnerActions, SpinnerEvents } from './spinner'
import { Events as SwapEvents, TrackEventAction as SwapTrackEventAction } from './swap'
import {
  Events as TaxCenterEvents,
  TrackEventAction as TaxCenterTrackEventAction
} from './taxCenter'
import {
  AnalyticsProperties as ViewAndClickAnalyticsProperties,
  Events as ViewAndClickEvents,
  TrackEventAction as ViewAndClickTrackEventAction
} from './viewAndClick'
import {
  Events as WalletEarnEvents,
  TrackEventAction as WalletEarnTrackEventAction
} from './walletEarnClientEvents'

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
  | ClientErrorTrackEventAction
  | CowboysPromoActions
  | DepositWithdrawalClientEventAction
  | DexEventAction
  | ExchangePromoActions
  | InterestClientTrackEventAction
  | LoginActions
  | MiscActions
  | NftsTrackEventAction
  | OnboardingAndVerificationTrackEventAction
  | RecommendedSweepTrackEventAction
  | PlaidClientactions
  | SellActions
  | SendCryptoActions
  | SofiActions
  | SpinnerActions
  | SwapTrackEventAction
  | TaxCenterTrackEventAction
  | CoinViewActions
  | ViewAndClickTrackEventAction
  | WalletEarnTrackEventAction

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
