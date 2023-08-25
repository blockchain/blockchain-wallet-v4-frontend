import {
  Events as AccountRecoveryEvents,
  TrackEventAction as AccountRecoveryTrackEventAction
} from './accountRecovery'
import { Events as BuyEvents, TrackEventAction as BuyTrackEventAction } from './buy'
import {
  Events as CoinViewEvents,
  TrackEventAction as TransactionsTrackEventAction
} from './coinView'
import {
  Events as CowboysPromoEvents,
  TrackEventAction as CowboysPromoTrackEventAction
} from './cowboysPromo'
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
import {
  Events as ExchangePromoEvents,
  TrackEventAction as ExchangePromoTrackEventAction
} from './exchangePromo'
import {
  AnalyticsProperties as InterestClientProperties,
  Events as InterestClientEvents,
  TrackEventAction as InterestClientTrackEventAction
} from './interestClient'
import { Events as LoginEvents, TrackEventAction as LoginTrackEventAction } from './login'
import { Events as MiscEvents, TrackEventAction as MiscTrackEventAction } from './misc'
import { Events as NftsEvents, TrackEventAction as NftsTrackEventAction } from './nfts'
import {
  AnalyticsProperties as OnboardingAndVerificationAnalyticsProperties,
  Events as OnboardingAndVerificationEvents,
  TrackEventAction as OnboardingAndVerificationTrackEventAction
} from './onboardingAndVerification'
import {
  Events as RecommendedSweepEvents,
  TrackEventAction as RecommendedSweepTrackEventAction
} from './recommendedimportsweep'
import { Events as SellEvents, TrackEventAction as SellTrackEventAction } from './sell'
import {
  Events as SendCryptoEvents,
  TrackEventAction as SendCryptoTrackEventAction
} from './sendCrypto'
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
  | ClientErrorEvents
  | DepositWithdrawalClientEvents
  | DexEvents
  | InterestClientEvents
  | LoginEvents
  | MiscEvents
  | NftsEvents
  | OnboardingAndVerificationEvents
  | SendCryptoEvents
  | TaxCenterEvents
  | CoinViewEvents
  | CowboysPromoEvents
  | ViewAndClickEvents
  | SwapEvents
  | WalletEarnEvents
  | BuyEvents
  | SellEvents
  | ExchangePromoEvents
  | RecommendedSweepEvents

const Analytics = {
  ...AccountRecoveryEvents,
  ...ClientErrorEvents,
  ...CoinViewEvents,
  ...CowboysPromoEvents,
  ...DepositWithdrawalClientEvents,
  ...DexEvents,
  ...InterestClientEvents,
  ...LoginEvents,
  ...MiscEvents,
  ...NftsEvents,
  ...OnboardingAndVerificationEvents,
  ...RecommendedSweepEvents,
  ...SendCryptoEvents,
  ...SwapEvents,
  ...TaxCenterEvents,
  ...ViewAndClickEvents,
  ...WalletEarnEvents,
  ...BuyEvents,
  ...SellEvents
}

// event properties
type AnalyticsProperties =
  | OnboardingAndVerificationAnalyticsProperties
  | ViewAndClickAnalyticsProperties
  | InterestClientProperties
  | DepositWithdrawalClientProperties

// event actions
type TrackEventAction =
  | AccountRecoveryTrackEventAction
  | ClientErrorTrackEventAction
  | DepositWithdrawalClientEventAction
  | DexEventAction
  | InterestClientTrackEventAction
  | LoginTrackEventAction
  | MiscTrackEventAction
  | NftsTrackEventAction
  | OnboardingAndVerificationTrackEventAction
  | RecommendedSweepTrackEventAction
  | SendCryptoTrackEventAction
  | SwapTrackEventAction
  | TaxCenterTrackEventAction
  | TransactionsTrackEventAction
  | ViewAndClickTrackEventAction
  | WalletEarnTrackEventAction
  | CowboysPromoTrackEventAction
  | BuyTrackEventAction
  | SellTrackEventAction
  | ExchangePromoTrackEventAction

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
