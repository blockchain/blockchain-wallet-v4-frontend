import { select } from '@redux-saga/core/effects'

import { selectors } from 'data'

import analytics from './analytics'
import { trackEvent as trackEventAction } from './slice'

export const trackEvent = function* ({ payload }: ReturnType<typeof trackEventAction>) {
  const { nabuUserId } = (yield select(
    selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
  )).getOrElse({ nabuUserId: '' })
  const email = (yield select(selectors.core.settings.getEmail)).getOrElse(null)
  const tiersState = (yield select(selectors.modules.profile.getTiers)).getOrElse({})
  const originalTimestamp = new Date().toISOString()
  const country = yield select(selectors.signup.getSignupCountry) || null
  const countryState = yield select(selectors.signup.getSignupCountryState) || null
  const properties = { originalTimestamp, ...payload.properties }

  analytics.push(payload.key, {
    properties,
    traits: {
      country,
      country_state: countryState,
      email,
      nabuId: nabuUserId,
      tier: tiersState.current
    }
  })
}
