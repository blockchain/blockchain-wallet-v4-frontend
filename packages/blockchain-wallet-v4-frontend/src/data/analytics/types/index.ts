import {
  AnalyticsProperties as OnboardingAndVerificationAnalyticsProperties,
  Events as OnboardingAndVerificationEvents,
  TrackEventAction as OnboardingAndVerificationTrackEventAction
} from './onboardingAndVerification'

const TRACK_EVENT = 'trackEvent'

type AnalyticsKey = OnboardingAndVerificationEvents
const Analytics = OnboardingAndVerificationEvents

// queevent properties
type AnalyticsProperties = OnboardingAndVerificationAnalyticsProperties

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

type TrackEventAction = OnboardingAndVerificationTrackEventAction

export { Analytics, AnalyticsKey, AnalyticsValue, RawEvent, TRACK_EVENT, TrackEventAction }
