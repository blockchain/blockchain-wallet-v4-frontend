import Remote from '@core/remote'

import { makeCoinfig } from '../test-utils/makeCoinfig'
import * as ResultAmountViewModel from './resultAmountViewModel'

const makeQuotePriceDataDummy = () => ({
  networkFee: '',
  price: '',
  resultAmount: '0.1320000000'
})

describe('ResultAmountViewModel', () => {
  describe('make', () => {
    const coinfigDummy = {
      ...makeCoinfig(),
      displaySymbol: 'ETH',
      precision: 10
    }

    describe('when there is no quote price', () => {
      it.each([Remote.Failure(''), Remote.Loading, Remote.NotAsked])(
        'should return default not refreshing view model',
        (quotePrice) => {
          expect(ResultAmountViewModel.make(quotePrice, coinfigDummy)).toEqual({
            isRefreshing: false,
            text: '0 ETH'
          })
        }
      )
    })

    describe('when quote price is based on placeholder value', () => {
      describe('and when it is not refreshing', () => {
        it('should return default not refreshing view model', () => {
          expect(
            ResultAmountViewModel.make(
              Remote.Success({
                data: makeQuotePriceDataDummy(),
                isPlaceholder: true,
                isRefreshing: false
              }),
              coinfigDummy
            )
          ).toEqual({
            isRefreshing: false,
            text: '0 ETH'
          })
        })
      })

      describe('and when it is refreshing', () => {
        it('should return default refreshing view model', () => {
          expect(
            ResultAmountViewModel.make(
              Remote.Success({
                data: makeQuotePriceDataDummy(),
                isPlaceholder: true,
                isRefreshing: true
              }),
              coinfigDummy
            )
          ).toEqual({
            isRefreshing: true,
            text: '0 ETH'
          })
        })
      })
    })

    describe('when quote price is refreshing', () => {
      it('should return refreshing view model with cached text value', () => {
        expect(
          ResultAmountViewModel.make(
            Remote.Success({
              data: makeQuotePriceDataDummy(),
              isPlaceholder: false,
              isRefreshing: true
            }),
            coinfigDummy
          )
        ).toEqual({
          isRefreshing: true,
          text: '0.132 ETH'
        })
      })
    })

    describe('when quote price is not refreshing', () => {
      it('should return refreshing view model up to date text value', () => {
        expect(
          ResultAmountViewModel.make(
            Remote.Success({
              data: makeQuotePriceDataDummy(),
              isPlaceholder: false,
              isRefreshing: false
            }),
            coinfigDummy
          )
        ).toEqual({
          isRefreshing: false,
          text: '0.132 ETH'
        })
      })
    })
  })
})
