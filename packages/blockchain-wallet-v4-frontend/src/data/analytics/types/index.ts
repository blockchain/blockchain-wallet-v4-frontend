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
import {
  AnalyticsProperties as OnboardingAndVerificationAnalyticsProperties,
  Events as OnboardingAndVerificationEvents,
  TrackEventAction as OnboardingAndVerificationTrackEventAction
} from './onboardingAndVerification'
import {
  AnalyticsProperties as ViewAndClickAnalyticsProperties,
  Events as ViewAndClickEvents,
  TrackEventAction as ViewAndClickTrackEventAction
} from './viewAndClick'

const TRACK_EVENT = 'trackEvent'

type AnalyticsKey =
  | OnboardingAndVerificationEvents
  | ViewAndClickEvents
  | LoginEvents
  | InterestClientEvents
  | DepositWithdrawalClientEvents
const Analytics = {
  ...OnboardingAndVerificationEvents,
  ...ViewAndClickEvents,
  ...LoginEvents,
  ...InterestClientEvents,
  ...DepositWithdrawalClientEvents
}

// queevent properties
type AnalyticsProperties =
  | OnboardingAndVerificationAnalyticsProperties
  | ViewAndClickAnalyticsProperties
  | InterestClientProperties
  | DepositWithdrawalClientProperties

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

type TrackEventAction =
  | OnboardingAndVerificationTrackEventAction
  | ViewAndClickTrackEventAction
  | LoginTrackEventAction
  | InterestClientTrackEventAction
  | DepositWithdrawalClientEventAction

export { Analytics, AnalyticsKey, AnalyticsValue, RawEvent, TRACK_EVENT, TrackEventAction }
