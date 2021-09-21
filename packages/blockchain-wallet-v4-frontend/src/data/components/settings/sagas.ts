import { equals, includes, path, prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'

import * as actions from '../../actions'
import * as selectors from '../../selectors'
import { actions as A } from './slice'

export const logLocation = 'components/settings/sagas'

export default ({ api, coreSagas }) => {
  const notificationsInitialized = function* () {
    try {
      const typesR = yield select(selectors.core.settings.getNotificationsType)
      const types = typesR.getOrElse([])
      const initialValues = {
        emailEnabled: includes(1, types),
        mobileEnabled: includes(32, types)
      }
      yield put(actions.form.initialize('settingsNotifications', initialValues))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'notificationsInitialized', e))
    }
  }

  const notificationsFormChanged = function* (action) {
    try {
      const form = path(['meta', 'form'], action)
      if (!equals('settingsNotifications', form)) return
      const formValues = yield select(selectors.form.getFormValues('settingsNotifications'))
      const emailEnabled = prop('emailEnabled', formValues)
      const mobileEnabled = prop('mobileEnabled', formValues)
      const types = {
        email: emailEnabled,
        mobile: mobileEnabled
      }
      yield call(coreSagas.settings.setNotificationsType, { types })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'notificationsFormChanged', e))
    }
  }

  const fetchProductsEligibility = function* () {
    try {
      yield put(A.fetchProductsEligibilityLoading())
      const userIdR = yield select(selectors.core.kvStore.userCredentials.getUserId)
      const userId = userIdR.getOrElse(null)
      if (userId) {
        const data = yield call(api.getProductsEligibility)
        yield put(A.fetchProductsEligibilitySuccess(data))
      } else {
        yield put(A.fetchProductsEligibilitySuccess(Remote.Success([])))
      }
    } catch (e) {
      yield put(A.fetchProductsEligibilityFailure(e))
    }
  }

  return {
    fetchProductsEligibility,
    notificationsFormChanged,
    notificationsInitialized
  }
}
