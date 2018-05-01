import sagas from './sagas'
import * as actions from '../../actions'
import * as chartService from 'services/ChartService'

describe('priceChart sagas', () => {
  let calcStartSpy = jest.spyOn(chartService, 'calculateStart').mockReturnValueOnce('test')
  let calcScaleSpy = jest.spyOn(chartService, 'calculateScale').mockReturnValueOnce('test')
  let actionSpy = jest.spyOn(actions.core.data.misc, 'fetchPriceIndexSeries').mockImplementation(() => jest.fn())

  it('should initialize correctly', () => {
    const saga = sagas({ api: {}, coreSagas: {} }).initialized({ type: 'whatever', payload: { coin: 'BTC', time: 'all' } })
    saga.next()
    expect(calcStartSpy).toHaveBeenCalledTimes(1)
    expect(calcStartSpy).toHaveBeenCalledWith('BTC', 'all')
    expect(calcScaleSpy).toHaveBeenCalledTimes(1)
    expect(calcScaleSpy).toHaveBeenCalledWith('BTC', 'all')
    expect(actionSpy).toHaveBeenCalledTimes(1)
    expect(actionSpy).toHaveBeenCalledWith('BTC', 'USD', 'test', 'test')
  })
})
