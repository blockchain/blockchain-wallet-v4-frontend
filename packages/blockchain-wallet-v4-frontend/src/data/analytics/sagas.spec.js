import { testSaga } from 'redux-saga-test-plan'

import * as actions from '../actions'
import { selectors } from 'data'
import analyticsSagas, { logLocation } from './sagas'

describe('analyticsSagas', () => {
  const {
    logEvent,
    logPageView,
    postMessage,
    startSession,
    stopSession
  } = analyticsSagas({})

  // describe('postMessage', () => {
  //   let message = ['fake', 'event']
  //   const saga = testSaga(postMessage, message)

  //   it('should select wallet helper url', () => {
  //     saga
  //       .next()
  //       .select(selectors.core.walletOptions.getWalletHelperUrl)
  //       .next()
  //       .next()
  //       .isDone()
  //   })

  //   it('should handle errors', () => {
  //     const error = new Error('ERROR')
  //     saga
  //       .restart()
  //       .next()
  //       .throw(error)
  //       .put(actions.logs.logErrorMessage(logLocation, 'postMessage', error))
  //   })
  // })

  describe('logEvent', () => {
    let payload = { event: ['FAKE', 'EVENT'] }
    const saga = testSaga(logEvent, { payload })

    it('should call to post message', () => {
      saga
        .next()
        .call(postMessage, {
          method: 'trackEvent',
          messageData: ['fake', 'event']
        })
        .next()
        .next()
        .isDone()
    })

    it('should handle errors', () => {
      const error = new Error('ERROR')
      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'logEvent', error))
    })
  })

  describe('logPageView', () => {
    let payload = { route: '/fakeRoute' }
    const saga = testSaga(logPageView, { payload })

    it('should check if user is authed', () => {
      saga.next().select(selectors.auth.isAuthenticated)
    })

    it('should call to post message', () => {
      saga.next(true).call(postMessage, {
        method: 'logPageView',
        messageData: { route: payload.route }
      })
    })

    it('should handle errors', () => {
      const error = new Error('ERROR')
      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'logPageView', error))
    })
  })

  describe('startSession', () => {
    let payload = { guid: '123-abc' }
    const saga = testSaga(startSession, { payload })

    it('should call to post message', () => {
      saga.next().call(postMessage, {
        method: 'setUserId',
        messageData: ['84a990f85c3cdd4']
      })
    })

    it('should handle errors', () => {
      const error = new Error('ERROR')
      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'startSession', error))
    })
  })

  describe('stopSession', () => {
    const saga = testSaga(stopSession)

    it('should call to post message', () => {
      saga.next().call(postMessage, {
        method: 'resetUserId',
        messageData: []
      })
    })

    it('should handle errors', () => {
      const error = new Error('ERROR')
      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'stopSession', error))
    })
  })
})
