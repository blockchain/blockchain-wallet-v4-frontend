import { select } from '@redux-saga/core/effects'

import { selectors } from 'data'

import analytics from './analytics'
import { trackEvent as trackEventAction } from './slice'

export const trackEvent = function* ({ payload }: ReturnType<typeof trackEventAction>) {
  const nabuId = (yield select(selectors.core.kvStore.userCredentials.getUserId)).getOrFail()
  const email = yield select(selectors.core.settings.getEmailVerified)
  const tiersState = (yield select(selectors.modules.profile.getTiers)).getOrElse({})

  const originalTimestamp = new Date().toISOString()

  const properties = { originalTimestamp, ...payload.properties }

  analytics.push(payload.key, {
    properties,
    traits: {
      email,
      nabuId,
      tier: tiersState.current
    }
  })
}
