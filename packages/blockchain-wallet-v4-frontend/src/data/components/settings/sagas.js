import { call, select, put } from 'redux-saga/effects'
import { contains, equals, path, prop } from 'ramda'
import * as actions from '../../actions'
import * as selectors from '../../selectors'

export const logLocation = 'components/settings/sagas'

export default ({ coreSagas }) => {
  const initializeBsv = function*() {
    try {
      yield call(coreSagas.kvStore.bsv.fetchMetadataBsv)
      yield call(coreSagas.data.bsv.fetchData)
      yield call(coreSagas.data.bsv.fetchRates)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeBsv', e))
    }
  }

  const notificationsInitialized = function*() {
    try {
      const typesR = yield select(selectors.core.settings.getNotificationsType)
      const types = typesR.getOrElse([])
      const initialValues = {
        emailEnabled: contains(1, types),
        mobileEnabled: contains(32, types)
      }
      yield put(actions.form.initialize('settingsNotifications', initialValues))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'notificationsInitialized', e)
      )
    }
  }

  const notificationsFormChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      if (!equals('settingsNotifications', form)) return
      const formValues = yield select(
        selectors.form.getFormValues('settingsNotifications')
      )
      const emailEnabled = prop('emailEnabled', formValues)
      const mobileEnabled = prop('mobileEnabled', formValues)
      const types = {
        email: emailEnabled,
        mobile: mobileEnabled
      }
      yield call(coreSagas.settings.setNotificationsType, { types })
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'notificationsFormChanged', e)
      )
    }
  }

  return {
    initializeBsv,
    notificationsInitialized,
    notificationsFormChanged
  }
}
