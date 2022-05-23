import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { renderHook, WrapperComponent } from '@testing-library/react-hooks'

import { useCoinAssetInfo } from '.'

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useSelector: jest.fn((selector) => selector())
  }
})

jest.mock('data', () => ({
  selectors: {
    core: {
      walletOptions: {
        getDomains: jest.fn(() => ({
          data: {
            api: 'https://blockchain.com'
          }
        }))
      }
    }
  }
}))

const queryClient = new QueryClient()
const wrapper: WrapperComponent<unknown> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCoinAboutSection()', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')

  afterAll(() => jest.resetAllMocks())

  describe('When assets api has all attributes for BTC', () => {
    beforeEach(() => {
      fetchSpy.mockImplementation((() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              description: 'Bitcoin description',
              website: 'https://bitcoin.org/en/',
              whitepaper: 'https://www.cryptocompare.com/media/37745820/bitcoin.pdf'
            })
        })) as jest.Mock)
    })

    it('Should load the coin information', async () => {
      const { result, waitFor } = renderHook(useCoinAssetInfo, {
        initialProps: {
          coin: 'BTC'
        },
        wrapper
      })

      await waitFor(() => result.current.isSuccess)

      expect(global.fetch).toHaveBeenCalledWith('https://blockchain.com/assets/info/BTC')
      expect(result.current.data?.description).toEqual('Bitcoin description')
      expect(result.current.data?.website).toEqual('https://bitcoin.org/en/')
      expect(result.current.data?.whitepaper).toEqual(
        'https://www.cryptocompare.com/media/37745820/bitcoin.pdf'
      )
    })
  })

  describe('When asset api dont have the attributes for coin', () => {
    beforeEach(() => {
      fetchSpy.mockImplementation((() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              description: '',
              website: '',
              whitepaper: ''
            })
        })) as jest.Mock)
    })

    it('Should parse the result when there is data missing', async () => {
      const { result, waitFor } = renderHook(useCoinAssetInfo, {
        initialProps: {
          coin: 'ETH'
        },
        wrapper
      })

      await waitFor(() => result.current.isSuccess)

      expect(global.fetch).toHaveBeenCalledWith('https://blockchain.com/assets/info/ETH')
      expect(result.current.data?.description).toBeUndefined()
      expect(result.current.data?.website).toBeUndefined()
      expect(result.current.data?.whitepaper).toBeUndefined()
    })
  })
})
