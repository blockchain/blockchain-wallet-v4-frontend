import { renderHook } from '@testing-library/react-hooks'

import { useCoinConfig } from '.'

describe('useCoinConfig()', () => {
  it('Should return the coin config from the window', () => {
    const { result } = renderHook(useCoinConfig, {
      initialProps: { coin: 'BTC' }
    })

    const config = result.current

    expect(config).toEqual(window.coins.BTC.coinfig)
  })
})
