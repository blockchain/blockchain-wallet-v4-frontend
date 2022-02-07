import {
  AnalyticsProperties as InterestClientProperties,
  Events as InterestClientEvents,
  TrackEventAction as InterestClientTrackEventAction
} from './interestClient'
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

type AnalyticsKey = OnboardingAndVerificationEvents | ViewAndClickEvents | InterestClientEvents
const Analytics = {
  ...OnboardingAndVerificationEvents,
  ...ViewAndClickEvents,
  ...InterestClientEvents
}

// queevent properties
type AnalyticsProperties =
  | OnboardingAndVerificationAnalyticsProperties
  | ViewAndClickAnalyticsProperties
  | InterestClientProperties

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
  | InterestClientTrackEventAction

export { Analytics, AnalyticsKey, AnalyticsValue, RawEvent, TRACK_EVENT, TrackEventAction }
