import { path, prop, groupBy, compose, map, head } from 'ramda'

import { createTestStore, getDispatchSpyReducer } from 'utils/testbed'
import { actions, selectors, model } from 'data'
import ratesSagas from './sagaRegister'
import ratesSocketSagas from 'data/middleware/webSocket/publicRates/sagaRegister'
import rateSocketSwitch from 'middleware/rateSocketSwitch'
import webSocketPublicRates, {
  fallbackInterval
} from 'middleware/webSocketPublicRates'
import ratesReducer from './reducers'
import profileReducer from 'data/modules/profile/reducers'
import { Remote } from 'blockchain-wallet-v4'

jest.useFakeTimers()

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

const reducers = {
  spy: spyReducer,
  rates: ratesReducer,
  profile: profileReducer
}

const pair = 'BTC-ETH'
const pairs = [pair, 'BTC-USD', 'ETH-USD']
const volume = 100
const fix = 'counterInFiat'
const fiatCurrency = 'USD'
const stubAdvice = {
  pair,
  fiatCurrency,
  fix,
  volume,
  currencyRatio: {
    base: {
      fiat: {
        symbol: 'USD',
        value: 96.77
      },
      crypto: {
        symbol: 'BTC',
        value: 0.15
      }
    },
    counter: {
      fiat: {
        symbol: 'USD',
        value: 100.0
      },
      crypto: {
        symbol: 'ETH',
        value: 0.27
      }
    }
  }
}
const ratesSocket = {
  connect (onOpen, onMessage, onClose, onError, fallback) {
    this.triggerOpen = onOpen
    this.triggerMessage = onMessage
    this.triggerClose = onClose
    this.triggerError = onError
    this.triggerFallback = fallback
  },
  close: jest.fn(),
  send: jest.fn(),
  isReady: jest.fn().mockReturnValue(true)
}

jest.spyOn(ratesSocket, 'connect')

const api = {
  fetchAdvice: jest.fn()
}

api.fetchAdvice.mockReturnValue({ ratio: stubAdvice.currencyRatio })

const sagas = [ratesSagas({ api }), ratesSocketSagas({ api, ratesSocket })]

const middlewares = [rateSocketSwitch, webSocketPublicRates(ratesSocket)]

describe('rates service', () => {
  let store
  beforeEach(() => {
    store = createTestStore(reducers, sagas, middlewares)
    store.dispatch(actions.middleware.webSocket.publicRates.startSocket())
    dispatchSpy.mockClear()
    api.fetchAdvice.mockClear()
    jest.clearAllTimers()
  })

  it('should connect to ratesSocket', () => {
    expect(ratesSocket.connect).toHaveBeenCalledTimes(1)
  })

  it('should close ratesSocket on stop', () => {
    store.dispatch(actions.middleware.webSocket.publicRates.stopSocket())
    expect(ratesSocket.close).toHaveBeenCalledTimes(1)
  })

  describe('new advice subscriptions', () => {
    beforeEach(() => {
      ratesSocket.send.mockClear()
      store.dispatch(
        actions.modules.rates.subscribeToAdvice(pair, volume, fix, fiatCurrency)
      )
    })

    it('should set initial advice for pair upon new subscription', () => {
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.NotAsked)
    })

    it('should set initial config for pair upon new subscription', () => {
      expect(
        path(['rates', 'pairs', pair, 'config'], store.getState())
      ).toEqual({ volume, fix, fiatCurrency })
    })

    it('should send subscription socket message upon new subscription', () => {
      expect(ratesSocket.send).toHaveBeenCalledTimes(1)
      expect(ratesSocket.send).toHaveBeenCalledWith(
        model.rates.getAdviceSubscribeMessage(pair, volume, fix, fiatCurrency)
      )
    })

    it('should trigger advice fetch if socket is not ready', () => {
      ratesSocket.send.mockClear()
      ratesSocket.isReady.mockReturnValueOnce(false)
      store.dispatch(
        actions.modules.rates.subscribeToAdvice(pair, volume, fix, fiatCurrency)
      )
      expect(ratesSocket.send).toHaveBeenCalledTimes(0)
      expect(api.fetchAdvice).toHaveBeenCalledTimes(1)
      expect(api.fetchAdvice).toHaveBeenCalledWith(
        pair,
        volume,
        fix,
        fiatCurrency
      )
    })
  })

  describe('advice unsubscription', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToAdvice(pair))
      ratesSocket.send.mockClear()
      store.dispatch(actions.modules.rates.unsubscribeFromAdvice(pair))
    })

    it('should send unsubscription socket message', () => {
      expect(ratesSocket.send).toHaveBeenCalledTimes(1)
      expect(ratesSocket.send).toHaveBeenCalledWith(
        model.rates.getAdviceUnsubscribeMessage(pair)
      )
    })

    it('should set pair to loading upon unsubscription', () => {
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.Loading)
    })
  })

  describe('new rates subscriptions', () => {
    beforeEach(() => {
      ratesSocket.send.mockClear()
      store.dispatch(actions.modules.rates.subscribeToRates(pairs))
    })

    it('should unsubscribe and set send subscription socket message upon new subscription', () => {
      expect(ratesSocket.send).toHaveBeenCalledTimes(2)
      expect(ratesSocket.send.mock.calls).toEqual([
        [model.rates.getRatesUnsubscribeMessage()],
        [model.rates.getRatesSubscribeMessage(pairs)]
      ])
    })
  })

  describe('rates unsubscription', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToRates(pairs))
      ratesSocket.send.mockClear()
      store.dispatch(actions.modules.rates.unsubscribeFromRates())
    })

    it('should send unsubscription socket message', () => {
      expect(ratesSocket.send).toHaveBeenCalledTimes(1)
      expect(ratesSocket.send).toHaveBeenCalledWith(
        model.rates.getRatesUnsubscribeMessage()
      )
    })

    it('should reset bestRates', () => {
      expect(store.getState().rates.bestRates).toEqual(Remote.NotAsked)
    })
  })

  describe('message handling', () => {
    beforeEach(() => {
      ratesSocket.send.mockClear()
      store.dispatch(actions.modules.rates.subscribeToAdvice(pair))
      store.dispatch(
        actions.modules.rates.updatePairConfig(pair, volume, fix, fiatCurrency)
      )
    })

    it('should set pair rate to loading', () => {
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.Loading)
    })

    it('should set pair rate to success upon advice message if fix and volume match', () => {
      ratesSocket.triggerMessage({
        ...model.rates.ADVICE_UPDATED_MESSAGE,
        quote: { ...stubAdvice }
      })
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.of(stubAdvice.currencyRatio))
    })

    it('should not update pair state upon advice message if fix does not match', () => {
      ratesSocket.triggerMessage({
        ...model.rates.ADVICE_UPDATED_MESSAGE,
        quote: { ...stubAdvice, fix: 'base' }
      })
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.NotAsked)
    })

    it('should not update pair state advice message if volume does not match', () => {
      ratesSocket.triggerMessage({
        ...model.rates.ADVICE_UPDATED_MESSAGE,
        quote: { ...stubAdvice, volume: volume + 1 }
      })
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.NotAsked)
    })

    it('should update bestRates upon rates message', () => {
      const rates = pairs.map(pair => ({ pair, rate: Math.random() }))
      const resultRates = compose(
        map(head),
        groupBy(prop('pair'))
      )(rates)
      ratesSocket.triggerMessage({
        ...model.rates.RATES_UPDATED_MESSAGE,
        pairs,
        rates
      })
      expect(selectors.modules.rates.getBestRates(store.getState())).toEqual(
        Remote.Success(resultRates)
      )
    })
  })

  describe('fallback', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToAdvice(pair))
      ratesSocket.triggerFallback()
    })

    it('should start fetchingRates once per fallbackInterval when falbback is triggered by socket', () => {
      expect(api.fetchAdvice).toHaveBeenCalledTimes(0)
      jest.advanceTimersByTime(fallbackInterval)
      expect(api.fetchAdvice).toHaveBeenCalledTimes(1)
      jest.advanceTimersByTime(fallbackInterval)
      expect(api.fetchAdvice).toHaveBeenCalledTimes(2)
    })

    it('should set rates when received response', () => {
      jest.advanceTimersByTime(fallbackInterval)
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.of(stubAdvice.currencyRatio))
    })

    it('should set rates error when request fails', () => {
      const stubError = new Error('stubError')
      api.fetchAdvice.mockReturnValue({ error: stubError })
      jest.advanceTimersByTime(fallbackInterval)
      expect(
        selectors.modules.rates.getPairAdvice(pair, store.getState())
      ).toEqual(Remote.Failure(stubError))
    })
  })
})
