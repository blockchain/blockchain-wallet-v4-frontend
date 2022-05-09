import { renderHook } from '@testing-library/react-hooks'

import { useFetcher } from '../useFetcher'
import { useCoinAssetInfo } from '.'

jest.mock('../useFetcher', () => ({
  useFetcher: jest.fn()
}))

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

describe('useCoinAboutSection()', () => {
  const useFetcherMock = useFetcher as jest.Mock

  it('Should load the coin information', () => {
    useFetcherMock.mockImplementation(() => ({
      data: {
        description: 'Bitcoin description',
        website: 'https://bitcoin.org/en/',
        whitepaper: 'https://www.cryptocompare.com/media/37745820/bitcoin.pdf'
      }
    }))

    const { result } = renderHook(useCoinAssetInfo, {
      initialProps: {
        coin: 'BTC'
      }
    })

    expect(useFetcherMock).toHaveBeenCalledWith('https://blockchain.com/assets/info/BTC')
    expect(result.current.data?.description).toEqual('Bitcoin description')
    expect(result.current.data?.website).toEqual('https://bitcoin.org/en/')
    expect(result.current.data?.whitepaper).toEqual(
      'https://www.cryptocompare.com/media/37745820/bitcoin.pdf'
    )
  })

  it('Should parse the result when there is data missing', () => {
    useFetcherMock.mockImplementation(() => ({
      data: {
        description: '',
        website: '',
        whitepaper: ''
      }
    }))

    const { result } = renderHook(useCoinAssetInfo, {
      initialProps: {
        coin: 'ETH'
      }
    })

    expect(useFetcherMock).toHaveBeenCalledWith('https://blockchain.com/assets/info/ETH')
    expect(result.current.data?.description).toBeUndefined()
    expect(result.current.data?.website).toBeUndefined()
    expect(result.current.data?.whitepaper).toBeUndefined()
  })
})
