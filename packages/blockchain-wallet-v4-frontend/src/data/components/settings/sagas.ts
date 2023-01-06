import { equals, includes, path, prop } from 'ramda'
import { call, put, select, take } from 'redux-saga/effects'

import { UserDataType } from 'data/types'

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

  const fetchLimitsAndDetails = function* () {
    try {
      yield put(A.fetchLimitsAndDetailsLoading())
      // get user tier
      yield put(actions.modules.profile.fetchUser())
      yield take([
        actions.modules.profile.fetchUserDataSuccess,
        actions.modules.profile.fetchUserDataFailure
      ])
      const userDataR = selectors.modules.profile.getUserData(yield select())
      const userData = userDataR.getOrElse({
        tiers: { current: 0 }
      } as UserDataType)

      const data = yield call(api.getLimitsAndFeaturesDetails, userData.tiers.current)
      yield put(A.fetchLimitsAndDetailsSuccess(data))
    } catch (e) {
      yield put(A.fetchLimitsAndDetailsFailure(e))
    }
  }

  return {
    fetchLimitsAndDetails,
    notificationsFormChanged,
    notificationsInitialized
  }
}
