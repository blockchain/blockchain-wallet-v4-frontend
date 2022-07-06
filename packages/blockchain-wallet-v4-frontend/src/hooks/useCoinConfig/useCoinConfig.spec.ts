import { renderHook } from '@testing-library/react-hooks'

import { useCoinConfig } from 'hooks'

describe('useCoinConfig()', () => {
  const originalWindowCoins = { ...window.coins }

  const populateWindowCoins = () => {
    window.coins = originalWindowCoins
  }

  beforeEach(() => {
    // @ts-ignore
    delete window.coins
  })

  afterEach(populateWindowCoins)

  it('Should start at the loading state and then provide the data when window.coins is populated', async () => {
    const { result, waitFor } = renderHook(() => useCoinConfig({ coin: 'BTC' }))

    expect(result.current.isLoading).toEqual(true)
    expect(result.current.data).toBeUndefined()

    populateWindowCoins()

    await waitFor(() => result.current.isLoading === false)

    expect(result.current.isLoading).toEqual(false)
    expect(result.current.data).toEqual(originalWindowCoins.BTC.coinfig)
  })
})
