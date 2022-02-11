import { createAction } from '@reduxjs/toolkit'

import { TRACK_EVENT, TrackEventAction } from './types/index'

const trackEvent = createAction<TrackEventAction>(TRACK_EVENT)

export { trackEvent }
