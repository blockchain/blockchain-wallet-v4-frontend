import { COMPLETE_PROFILE_STEPS } from 'blockchain-wallet-v4-frontend/src/modals/Onboarding/CompleteProfile/types'

const TRACK_EVENT = 'trackEvent'

enum AnalyticsKey {
  PEEKSHEET_DISMISSED = 'Peeksheet Dismissed',
  PEEKSHEET_SELECTION_CLICKED = 'Peeksheet Selection Clicked',
  PEEKSHEET_VIEWED = 'Peeksheet Viewed'
}

type AnalyticsTraits = {
  email?: string
  nabuId: string
  tier?: number
}

type BasePayload = {
  originalTimestamp: string
}

type PeakSheetCurrentStep = {
  current_step_completed: number
}
type PeakSheetButtonClick = {
  button_clicked: boolean
  item: COMPLETE_PROFILE_STEPS
}

// queevent properties
type PeakSheetAnalyticsProperties = BasePayload & (PeakSheetCurrentStep | PeakSheetButtonClick)

type AnalyticsProperties = PeakSheetAnalyticsProperties

type AnalyticsValue = {
  properties: AnalyticsProperties
  traits: AnalyticsTraits
}

type RawEvent = {
  key: AnalyticsKey
  payload: AnalyticsValue
}

type PeekSheetDismissPayloadAction = {
  key: AnalyticsKey.PEEKSHEET_DISMISSED
  properties: PeakSheetCurrentStep
}

type PeekSheetViewedPayloadAction = {
  key: AnalyticsKey.PEEKSHEET_VIEWED
  properties: PeakSheetCurrentStep
}

type PeekSheetSelectionClickedPayloadAction = {
  key: AnalyticsKey.PEEKSHEET_SELECTION_CLICKED
  properties: PeakSheetCurrentStep & PeakSheetButtonClick
}

type TrackEventAction =
  | PeekSheetDismissPayloadAction
  | PeekSheetViewedPayloadAction
  | PeekSheetSelectionClickedPayloadAction

export { AnalyticsKey, AnalyticsValue, RawEvent, TRACK_EVENT, TrackEventAction }
