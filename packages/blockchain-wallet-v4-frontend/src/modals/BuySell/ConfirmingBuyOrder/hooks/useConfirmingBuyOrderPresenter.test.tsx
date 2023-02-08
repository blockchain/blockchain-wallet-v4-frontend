import React from 'react'
import { Provider } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'
import configureStore from 'redux-mock-store'

import Remote from '@core/remote'
import { RemoteDataType } from '@core/remote/types'
import { NabuError } from 'services/errors'

import { useConfirmingBuyOrderPresenter, ViewModelType } from './useConfirmingBuyOrderPresenter'

const setup = (
  order: RemoteDataType<Error | string, unknown> = Remote.NotAsked,
  pendingOrder: unknown = {}
) => {
  const store = configureStore()({
    components: {
      buySell: { order, pendingOrder }
    }
  })

  return {
    ...renderHook(useConfirmingBuyOrderPresenter, {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    }),
    store
  }
}

describe('useConfirmingBuyOrderPresenter', () => {
  describe('when order is not in failure state', () => {
    it.each([Remote.NotAsked, Remote.Loading, Remote.Success(null)])(
      'should return view model in loading state',
      (orderR) => {
        const { result } = setup(orderR)

        expect(result.current.viewModel).toEqual({
          type: ViewModelType.Loading
        })
      }
    )
  })

  describe('when order is in failure state', () => {
    describe('and when error is nabu error', () => {
      it('should return view model in nabu error state', () => {
        const errorStub = new NabuError({
          message: 'Test error message',
          title: 'Test error title'
        })
        const { result } = setup(Remote.Failure(errorStub))

        expect(result.current.viewModel).toEqual({
          error: errorStub,
          handleError: expect.any(Function),
          type: ViewModelType.NabuError
        })
      })
    })

    describe('and when error is generic error', () => {
      it('should return view model in generic error state', () => {
        const errorStub = 'Test error string'
        const { result } = setup(Remote.Failure(errorStub))

        expect(result.current.viewModel).toEqual({
          error: errorStub,
          handleError: expect.any(Function),
          type: ViewModelType.GenericError
        })
      })
    })

    describe('and when handleError is called', () => {
      describe('and when there is a pending order', () => {
        it('should dispatch order cancellation action', () => {
          const errorStub = 'Test error string'
          const { result, store } = setup(Remote.Failure(errorStub))

          if (result.current.viewModel.type !== ViewModelType.Loading) {
            result.current.viewModel.handleError()
          }

          expect(store.getActions()).toEqual([
            {
              payload: {},
              type: 'buySell/cancelOrder'
            }
          ])
        })
      })

      describe('otherwise', () => {
        it('should dispatch destroy checkout action', () => {
          const errorStub = 'Test error string'
          const { result, store } = setup(Remote.Failure(errorStub), null)

          if (result.current.viewModel.type !== ViewModelType.Loading) {
            result.current.viewModel.handleError()
          }

          expect(store.getActions()).toEqual([
            {
              type: 'buySell/destroyCheckout'
            }
          ])
        })
      })
    })
  })

  describe('when onError is called', () => {
    describe('and when error is not an object', () => {
      it('should dispatch tracking event with correct payload', () => {
        const { result, store } = setup()

        result.current.onError('Test error string')

        expect(store.getActions()).toEqual([
          {
            payload: {
              key: 'Client Error',
              properties: {
                action: 'ConfirmingBuyOrder',
                error: 'OOPS_ERROR',
                network_error_description: 'Test error string',
                source: 'NABU',
                title: 'Oops! Something went wrong'
              }
            },
            type: 'trackEvent'
          }
        ])
      })
    })

    describe('and when error is an object', () => {
      it('should dispatch tracking event with correct payload', () => {
        const { result, store } = setup()

        result.current.onError(
          new NabuError({
            message: 'Test error message',
            title: 'Test error title'
          })
        )

        expect(store.getActions()).toEqual([
          {
            payload: {
              key: 'Client Error',
              properties: {
                action: 'ConfirmingBuyOrder',
                error: 'OOPS_ERROR',
                source: 'NABU',
                title: 'Oops! Something went wrong'
              }
            },
            type: 'trackEvent'
          }
        ])
      })
    })
  })
})
