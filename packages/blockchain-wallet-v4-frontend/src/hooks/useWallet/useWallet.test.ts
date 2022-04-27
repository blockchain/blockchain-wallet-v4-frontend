import { renderHook } from '@testing-library/react-hooks'
import { createRemoteSuccessState } from 'hooks'

import { useWalletsForCoin } from '../useWalletsForCoin'
import { useWallet } from '.'

jest.mock('../useWalletsForCoin', () => ({
  useWalletsForCoin: jest.fn()
}))

describe('useWallets()', () => {
  const useWalletsForCoinMock = useWalletsForCoin as jest.Mock
  const btcOneWallet = { address: '1', coin: 'BTC' }
  const btcTwoWallet = { address: '2', coin: 'BTC' }
  const ethWallet = { address: '3', coin: 'ETH' }

  beforeEach(() => {
    useWalletsForCoinMock.mockImplementation(() =>
      createRemoteSuccessState([btcOneWallet, btcTwoWallet, ethWallet])
    )
  })

  it('Should select the correct wallet by address', () => {
    const { result } = renderHook(useWallet, {
      initialProps: {
        address: '1',
        coin: 'BTC'
      }
    })

    expect(result.current.data).toEqual(btcOneWallet)
    expect(useWalletsForCoinMock).toHaveBeenCalledWith({ coin: 'BTC' })
  })

  it('Should return undefined if the wallet is not present', () => {
    const { result } = renderHook(useWallet, {
      initialProps: {
        address: 'NOT PRESENT ADDRESS',
        coin: 'BTC'
      }
    })

    expect(result.current.data).toBeUndefined()
    expect(useWalletsForCoinMock).toHaveBeenCalledWith({ coin: 'BTC' })
  })
})
