import { testSaga } from 'redux-saga-test-plan'

import * as S from '../../selectors'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import settingsSagas, { logLocation } from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')

const coreSagas = coreSagasFactory({ api: {} })

describe('settings sagas', () => {
  const {
    initializeBsv,
    notificationsInitialized,
    notificationsFormChanged
  } = settingsSagas({ coreSagas })

  describe('initializeBsv', () => {
    const saga = testSaga(initializeBsv)

    it('should call to fetch bsvMetadata', () => {
      saga.next().call(coreSagas.kvStore.bsv.fetchMetadataBsv)
    })

    it('should call to fetch bsv data', () => {
      saga.next().call(coreSagas.data.bsv.fetchData)
    })

    it('should call to fetch bsv rates', () => {
      saga.next().call(coreSagas.data.bsv.fetchRates)
    })

    it('should end', () => {
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed to fetch data' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'initializeBsv', error))
        .next()
        .isDone()
    })
  })

  describe('notificationsInitialized', () => {
    const saga = testSaga(notificationsInitialized)
    const mockSettings = {
      emailEnabled: false,
      mobileEnabled: false
    }
    it('should select notifications type', () => {
      saga.next().select(S.core.settings.getNotificationsType)
    })

    it('should put initialize form action', () => {
      saga
        .next(Remote.of([]))
        .put(actions.form.initialize('settingsNotifications', mockSettings))
    })

    it('should end', () => {
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'notificationsInitialized',
            error
          )
        )
        .next()
        .isDone()
    })
  })

  describe('notificationsFormChanged', () => {
    it('should return if no form data exists', () => {
      const saga = testSaga(notificationsFormChanged, {})
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const saga = testSaga(notificationsFormChanged, {
        meta: { form: 'settingsNotifications' }
      })
      const error = { message: 'failed' }
      saga
        .next()
        .throw(error)
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'notificationsFormChanged',
            error
          )
        )
    })
  })
})
