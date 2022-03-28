import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { UseCoinIconColor } from './types'

const mapCoinIconColor: Record<string, string> = {
  AAVE: '#2EBAC6',
  ALGO: '#000000',
  BAT: '#FF4724',
  CLOUT: '#000000',
  COMP: '#00D395',
  DAI: '#F5AC37',
  DOGE: '#C2A633',
  DOT: '#E6007A',
  ENJ: '#624DBF',
  EOS: '#000000',
  ETC: '#33FF99',
  LINK: '#2A5ADA',
  LTC: '#BFBBBB',
  MOB: '#243855',
  NEAR: '#000000',
  OGN: '#1A82FF',
  PAX: '#00522C',
  STX: '#211F6D',
  THETA: '#2AB8E6',
  UNI: '#FF007A',
  USDC: '#2775CA',
  USDT: '#26A17B',
  WDGLD: '#A39424',
  XTZ: '#2C7DF7',
  YFI: '#0074FA',
  ZEN: '#041742'
}

export const useCoinIconColor: UseCoinIconColor = (coin) => {
  const { grey600 } = useContext(ThemeContext)

  return mapCoinIconColor[coin] ?? grey600
}
