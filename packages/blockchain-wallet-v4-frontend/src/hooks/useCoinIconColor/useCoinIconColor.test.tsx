import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ThemeProvider } from 'styled-components'

import { Palette } from 'blockchain-info-components'

import { useCoinIconColor } from '.'

describe('#useCoinIconColor()', () => {
  const createHook = ({ value }: { value: string }) => {
    const { result } = renderHook(() => useCoinIconColor(value), {
      wrapper: ({ children }) => <ThemeProvider theme={Palette('light')}>{children}</ThemeProvider>
    })

    return {
      getResultValue: () => result.current
    }
  }

  it('Should default to blue600 when the icon is not mapped', () => {
    const { getResultValue } = createHook({
      value: 'coin that is not mapped'
    })

    expect(getResultValue()).toEqual('#677184')
  })

  it('Should return the PAX color from the mapped colors', () => {
    const { getResultValue } = createHook({
      value: 'PAX'
    })

    expect(getResultValue()).toEqual('#00522C')
  })
})
