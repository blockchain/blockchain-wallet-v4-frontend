import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'

import { AppDeeplinkPayload, AppDeeplinkRoute } from './types.deeplinks'

// maps routes to specific actions for the deeplink
// routes will start with either /app (new format) or /open (legacy goals format)
const deeplinkExecutionMap = function* (route: AppDeeplinkRoute) {
  switch (route) {
    case '/open/swap':
      yield put(actions.goals.saveGoal({ data: {}, name: 'swap' }))
      break
    default:
      console.error('Deeplink map missing')
      break
  }
}

// determines if there is a deeplink stored and if so, calls to execute
export const checkForAndRouteDeeplinks = function* () {
  const deeplinkData = (yield select(selectors.auth.getDeeplinkData)) as AppDeeplinkPayload
  if (deeplinkData) {
    yield call(deeplinkExecutionMap, deeplinkData.route)
  }
}
