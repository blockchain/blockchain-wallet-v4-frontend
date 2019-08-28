import { put } from 'redux-saga/effects'
import { actions } from 'data'

export default () => {
  const logLocation = 'modules/router/sagas'

  const changeLocation = function * ({ payload }) {
    try {
      const { location, action } = payload
      yield put(actions.analytics.logPageView(location.pathname))
      yield put(actions.modals.closeAllModals())
      if (action === 'POP' && location.pathname === '/login') {
        yield put(actions.auth.logout())
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'router change location', e)
      )
    }
  }

  return {
    changeLocation
  }
}
