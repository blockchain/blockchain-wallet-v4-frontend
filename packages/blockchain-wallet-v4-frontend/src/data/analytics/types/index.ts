import {
  Events as AccountRecoveryEvents,
  TrackEventAction as AccountRecoveryTrackEventAction
} from './accountRecovery'
import {
  AnalyticsProperties as DepositWithdrawalClientProperties,
  Events as DepositWithdrawalClientEvents,
  TrackEventAction as DepositWithdrawalClientEventAction
} from './depositWithdrawalClient'
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
  Events as TaxCenterEvents,
  TrackEventAction as TaxCenterTrackEventAction
} from './taxCenter'
import {
  AnalyticsProperties as ViewAndClickAnalyticsProperties,
  Events as ViewAndClickEvents,
  TrackEventAction as ViewAndClickTrackEventAction
} from './viewAndClick'

const TRACK_EVENT = 'trackEvent'

type AnalyticsKey =
  | AccountRecoveryEvents
  | OnboardingAndVerificationEvents
  | ViewAndClickEvents
  | LoginEvents
  | MiscEvents
  | InterestClientEvents
  | DepositWithdrawalClientEvents
  | TaxCenterEvents
  | NftsEvents

const Analytics = {
  ...AccountRecoveryEvents,
  ...OnboardingAndVerificationEvents,
  ...ViewAndClickEvents,
  ...LoginEvents,
  ...MiscEvents,
  ...InterestClientEvents,
  ...DepositWithdrawalClientEvents,
  ...TaxCenterEvents,
  ...NftsEvents
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
  | OnboardingAndVerificationTrackEventAction
  | ViewAndClickTrackEventAction
  | LoginTrackEventAction
  | MiscTrackEventAction
  | InterestClientTrackEventAction
  | DepositWithdrawalClientEventAction
  | TaxCenterTrackEventAction
  | NftsTrackEventAction

type AnalyticsTraits = {
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
