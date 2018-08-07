import BigNumber from 'bignumber.js'

import { createTestStore, getDispatchSpyReducer } from 'utils/testbed'
import { actions, selectors, model } from 'data'
import ratesSagas from './sagaRegister'
import ratesSocketSagas from 'data/middleware/webSocket/rates/sagaRegister'
import webSocketRates, { fallbackInterval } from 'middleware/webSocketRates'
import ratesReducer from './reducers'
import { Remote } from 'blockchain-wallet-v4'

jest.useFakeTimers()

const { dispatchSpy, spyReducer } = getDispatchSpyReducer()

const reducers = {
  spy: spyReducer,
  rates: ratesReducer
}

const ratesPair = 'BTC-ETH'
const stubQuote = {
  bestAsk: '10.329947383907252',
  bestBid: '10.257204619224963',
  askTiers: [
    {
      volume: '0.1',
      price: '10.329947383907252'
    },
    {
      volume: '0.2',
      price: '10.429947383907251'
    },
    {
      volume: '0.5',
      price: '10.52994738390725'
    },
    {
      volume: '0.7',
      price: '10.629947383907252'
    }
  ],
  bidTiers: [
    {
      volume: '0.1',
      price: '10.257204619224963'
    },
    {
      volume: '0.2',
      price: '10.157204619224963'
    },
    {
      volume: '0.5',
      price: '10.057204619224963'
    },
    {
      volume: '0.7',
      price: '9.957204619224962'
    }
  ],
  time: '2018-07-20T11:37:09.563Z'
}
const stubVolume1 = '0.1'
const quoteRate1 = '10.329947383907252'
const stubVolume2 = '0.2'
const quoteRate2 = '10.3799473839072515'
const stubVolume3 = '2'
const quoteRate3 = '10.5699473839072514'
const ratesSocket = {
  connect (onOpen, onMessage, onClose, onError, fallback) {
    this.triggerOpen = onOpen
    this.triggerMessage = onMessage
    this.triggerClose = onClose
    this.triggerError = onError
    this.triggerFallback = fallback
  },
  close: jest.fn(),
  send: jest.fn()
}

jest.spyOn(ratesSocket, 'connect')

const api = {
  fetchRates: jest.fn()
}

api.fetchRates.mockReturnValue(stubQuote)

const sagas = [ratesSagas(), ratesSocketSagas({ api, ratesSocket })]

const middlewares = [webSocketRates(ratesSocket)]

describe('rates service', () => {
  let store
  beforeEach(() => {
    store = createTestStore(reducers, sagas, middlewares)
    store.dispatch(actions.middleware.webSocket.rates.startSocket())
    dispatchSpy.mockClear()
    api.fetchRates.mockClear()
    jest.clearAllTimers()
  })

  it('should connect to ratesSocket', () => {
    expect(ratesSocket.connect).toHaveBeenCalledTimes(1)
  })

  it('should close ratesSocket on stop', () => {
    store.dispatch(actions.middleware.webSocket.rates.stopSocket())
    expect(ratesSocket.close).toHaveBeenCalledTimes(1)
  })

  describe('new subscriptions', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
      ratesSocket.send.mockClear()
    })

    it('should set initial rate for pair upon new subscription', () => {
      const newPairs = ['BTC-BCH', 'BCH-BTC']
      store.dispatch(actions.modules.rates.subscribeToRates(newPairs))
      expect(
        selectors.modules.rates.getPairRate(
          newPairs[0],
          stubVolume1,
          store.getState()
        )
      ).toEqual(Remote.NotAsked)
      expect(
        selectors.modules.rates.getPairRate(
          newPairs[1],
          stubVolume1,
          store.getState()
        )
      ).toEqual(Remote.NotAsked)
    })

    it('should set send subscription socket message upon new subscription', () => {
      const newPairs = ['BTC-BCH', 'BCH-BTC']
      store.dispatch(actions.modules.rates.subscribeToRates(newPairs))
      expect(ratesSocket.send).toHaveBeenCalledTimes(1)
      expect(ratesSocket.send).toHaveBeenCalledWith(
        model.rates.getPairSubscribeMessage(newPairs)
      )
    })
  })

  describe('subscription count', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
    })

    it('should increase refs count', () => {
      expect(store.getState().rates[ratesPair].refs).toEqual(1)
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
      expect(store.getState().rates[ratesPair].refs).toEqual(2)
    })

    it('should dencrease refs count', () => {
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
      expect(store.getState().rates[ratesPair].refs).toEqual(2)
      store.dispatch(actions.modules.rates.unsubscribeFromRates([ratesPair]))
      expect(store.getState().rates[ratesPair].refs).toEqual(1)
    })
  })

  describe('unsubscription', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
      ratesSocket.send.mockClear()
      store.dispatch(actions.modules.rates.unsubscribeFromRates([ratesPair]))
    })

    it('should send unsubscription socket message', () => {
      expect(ratesSocket.send).toHaveBeenCalledTimes(1)
      expect(ratesSocket.send).toHaveBeenCalledWith(
        model.rates.getPairUnsubscribeMessage([ratesPair])
      )
    })
  })

  describe('message handling', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
    })

    it('should set pair rate to loading upon subscription success message', () => {
      ratesSocket.triggerMessage({
        ...model.rates.SUBSCRIBE_SUCCESS_MESSAGE,
        pair: ratesPair
      })
      expect(
        selectors.modules.rates.getPairRate(
          ratesPair,
          stubVolume1,
          store.getState()
        )
      ).toEqual(Remote.Loading)
    })

    it('should set pair rate to success upon quote message', () => {
      ratesSocket.triggerMessage({
        ...model.rates.QUOTES_MESSAGE,
        pair: ratesPair,
        quote: stubQuote
      })
      expect(
        selectors.modules.rates.getPairRate(
          ratesPair,
          stubVolume1,
          store.getState()
        )
      ).toEqual(Remote.of(new BigNumber(quoteRate1)))
      expect(
        selectors.modules.rates.getPairRate(
          ratesPair,
          stubVolume2,
          store.getState()
        )
      ).toEqual(Remote.of(new BigNumber(quoteRate2)))
      expect(
        selectors.modules.rates.getPairRate(
          ratesPair,
          stubVolume3,
          store.getState()
        )
      ).toEqual(Remote.of(new BigNumber(quoteRate3)))
    })

    it('should remove pair upon unsubscription success socket message', () => {
      ratesSocket.triggerMessage({
        ...model.rates.UNSUBSCRIBE_SUCCESS_MESSAGE,
        pair: ratesPair
      })
      expect(store.getState().rates).toEqual({})
    })
  })

  describe('fallback', () => {
    beforeEach(() => {
      store.dispatch(actions.modules.rates.subscribeToRates([ratesPair]))
      ratesSocket.triggerFallback()
    })

    it('should start fetchingRates once per fallbackInterval when falbback is triggered by socket', () => {
      expect(api.fetchRates).toHaveBeenCalledTimes(0)
      jest.advanceTimersByTime(fallbackInterval)
      expect(api.fetchRates).toHaveBeenCalledTimes(1)
      jest.advanceTimersByTime(fallbackInterval)
      expect(api.fetchRates).toHaveBeenCalledTimes(2)
    })

    it('should set rates when received response', () => {
      jest.advanceTimersByTime(fallbackInterval)
      expect(
        selectors.modules.rates.getPairRate(
          ratesPair,
          stubVolume1,
          store.getState()
        )
      ).toEqual(Remote.of(new BigNumber(quoteRate1)))
    })

    it('should set rates error when request fails', () => {
      const stubError = new Error('stubError')
      api.fetchRates.mockImplementation(() => {
        throw stubError
      })
      jest.advanceTimersByTime(fallbackInterval)
      expect(
        selectors.modules.rates.getPairRate(
          ratesPair,
          stubVolume1,
          store.getState()
        )
      ).toEqual(Remote.Failure(stubError))
      api.fetchRates.mockReturnValue(stubQuote)
    })
  })
})
