import { createAction } from '@reduxjs/toolkit'

import { TRACK_EVENT, TrackEventAction } from './types'

const trackEvent = createAction<TrackEventAction>(TRACK_EVENT)

export { trackEvent }
