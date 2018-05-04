import sagas from './sagas'
import * as actions from '../../actions'
import * as chartService from 'services/ChartService'

jest.mock('./selectors')

describe('priceChart sagas', () => {
  let calcScaleSpy
  let calcStartSpy
  let fetchPriceActionSpy

  beforeEach(() => {
    calcStartSpy = jest.spyOn(chartService, 'calculateStart').mockReturnValueOnce('test')
    calcScaleSpy = jest.spyOn(chartService, 'calculateScale').mockReturnValueOnce('test')
    fetchPriceActionSpy = jest.spyOn(actions.core.data.misc, 'fetchPriceIndexSeries').mockImplementation(() => { return 't' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('initialized saga', () => {
    it('should run correct routine', () => {
      // arrange
      const saga = sagas({}).initialized({type: '', payload: {coin: 'BTC', time: 'all'}})

      // act
      saga.next()

      // assert
      expect(calcStartSpy).toHaveBeenCalledTimes(1)
      expect(calcStartSpy).toHaveBeenCalledWith('BTC', 'all')
      expect(calcScaleSpy).toHaveBeenCalledTimes(1)
      expect(calcScaleSpy).toHaveBeenCalledWith('BTC', 'all')
      expect(fetchPriceActionSpy).toHaveBeenCalledTimes(1)
      expect(fetchPriceActionSpy).toHaveBeenCalledWith('BTC', 'USD', 'test', 'test')
    })

    // it('should handle errors', () => {
    //   // arrange
    //   fetchPriceActionSpy = jest.spyOn(actions.core.data.misc, 'fetchPriceIndexSeries').mockImplementation(() => { throw new Error('') })
    //   const saga = sagas({}).initialized({type: '', payload: {coin: 'BTC', time: 'all'}})
    //
    //   // act
    //   saga.next()
    //
    //   // assert
    //   expect(fetchPriceActionSpy).toHaveBeenCalledTimes(1)
    //   expect(errorSpy).toHaveBeenCalledWith('Error in initialized saga')
    // })
  })

  // describe('coinClicked saga', () => {
  //   it('should run correct routine', () => {
  //     // arrange
  //     const saga = sagas({}).coinClicked({type: '', payload: {coin: 'BTC'}})
  //     calcStartSpy = jest.spyOn(chartService, 'calculateStart').mockReturnValueOnce('test')
  //     calcScaleSpy = jest.spyOn(chartService, 'calculateScale').mockReturnValueOnce('test')
  //
  //     saga.next()
  //     saga.next()
  //
  //     // act/assert
  //     expect(calcStartSpy).toHaveBeenCalledTimes(1)
  //     expect(calcStartSpy).toHaveBeenCalledWith('BTC', 'MOCK_TIME')
  //   })
  //
  //   it('should run correct routine', () => {
  //    // var t = effects
  //     // arrange
  //     jest.spyOn(effects, 'select').mockImplementation(() => {
  //       return 'test'
  //     })
  //     const saga = sagas({}).coinClicked({type: '', payload: {coin: 'BTC'}})
  //
  //     // act/assert
  //     let next = saga.next()
  //     expect(next.value).toEqual('test')
  //
  //     // act/assert
  //     saga.next()
  //     expect(calcStartSpy).toHaveBeenCalledTimes(1)
  //     expect(calcStartSpy).toHaveBeenCalledWith('BTC', 'test')
  //     expect(calcScaleSpy).toHaveBeenCalledTimes(1)
  //     expect(calcScaleSpy).toHaveBeenCalledWith('BTC', 'all')
  //     expect(fetchPriceActionSpy).toHaveBeenCalledTimes(1)
  //     expect(fetchPriceActionSpy).toHaveBeenCalledWith('BTC', 'USD', 'test', 'test')
  //   })
  //
  //   it('should handle errors', () => {
  //     // arrange
  //     fetchPriceActionSpy = jest.spyOn(actions.core.data.misc, 'fetchPriceIndexSeries').mockImplementation(() => { throw new Error('') })
  //     const saga = sagas({api: {}, coreSagas: {}}).initialized({type: '', payload: {coin: 'BTC'}})
  //
  //     // act
  //     saga.next()
  //
  //     // assert
  //     expect(fetchPriceActionSpy).toHaveBeenCalledTimes(1)
  //     expect(errorSpy).toHaveBeenCalledWith('Error in Initialized Price Chart Saga')
  //   })
  // })
})
