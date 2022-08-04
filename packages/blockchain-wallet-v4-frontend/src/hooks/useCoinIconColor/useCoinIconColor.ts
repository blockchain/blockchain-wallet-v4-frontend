import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { UseCoinIconColor } from './types'
import { getCoinColor } from './utils'

export const useCoinIconColor: UseCoinIconColor = (coin) => {
  const { grey600 } = useContext(ThemeContext)

  return getCoinColor(coin) ?? grey600
}
