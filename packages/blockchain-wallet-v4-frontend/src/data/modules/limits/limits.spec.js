import { createTestStore, getDispatchSpyReducer } from 'utils/testbed'
import * as A from './actions'
import * as S from './selectors'
import limitsSagas from './sagaRegister'
import limitsReducer from './reducers'
import { Remote } from 'blockchain-wallet-v4'

const { spyReducer } = getDispatchSpyReducer()

const reducers = {
  spy: spyReducer,
  limits: limitsReducer
}

const FETCH_TIMEOUT = 100
const STUB_CURRENCY = 'USD'
const STUB_LIMITS = {
  currency: 'USD',
  minOrder: '10.0',
  maxOrder: '1000.0',
  maxPossibleOrder: '100.0',
  daily: {
    limit: '5000.0',
    available: '100.0',
    used: '4900.0'
  },
  weekly: {
    limit: '10000.0',
    available: '5000.0',
    used: '5000.0'
  },
  annual: {
    limit: '50000.0',
    available: '40000.0',
    used: '10000.0'
  }
}
const STUB_ERROR = {
  description: 'Unknown error'
}

jest.useFakeTimers()
const api = {
  fetchLimits: jest.fn()
}

api.fetchLimits.mockReturnValue(STUB_LIMITS)

const sagas = [limitsSagas({ api })]
describe('limits service', () => {
  let store
  beforeEach(() => {
    store = createTestStore(reducers, sagas)
    api.fetchLimits.mockClear()
    jest.clearAllTimers()
  })

  it('should have initial state of not asked', () => {
    expect(S.getLimits(STUB_CURRENCY, store.getState())).toEqual(
      Remote.NotAsked
    )
  })

  it('should call fetchLimits api', () => {
    store.dispatch(A.fetchLimits(STUB_CURRENCY))
    expect(api.fetchLimits).toHaveBeenCalledTimes(1)
  })

  it('should set limits once loaded', async () => {
    store.dispatch(A.fetchLimits(STUB_CURRENCY))
    expect(S.getLimits(STUB_CURRENCY, store.getState())).toEqual(
      Remote.of(STUB_LIMITS)
    )
  })

  it('should set loading state while loading', async () => {
    api.fetchLimits.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve(STUB_LIMITS), FETCH_TIMEOUT)
        )
    )
    store.dispatch(A.fetchLimits(STUB_CURRENCY))
    expect(S.getLimits(STUB_CURRENCY, store.getState())).toEqual(Remote.Loading)
    await jest.advanceTimersByTime(FETCH_TIMEOUT + 1)
    expect(S.getLimits(STUB_CURRENCY, store.getState())).not.toEqual(
      Remote.Loading
    )
  })

  it('should set error state', async () => {
    api.fetchLimits.mockImplementation(() => {
      throw STUB_ERROR
    })
    store.dispatch(A.fetchLimits(STUB_CURRENCY))
    expect(S.getLimits(STUB_CURRENCY, store.getState())).toEqual(
      Remote.Failure(STUB_ERROR)
    )
  })
})
