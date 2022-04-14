import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { CurrencyHook } from './types'

export const useCurrency: CurrencyHook = () => {
  return useSelector((state) => {
    return selectors.core.settings.getCurrency(state).getOrElse('USD')
  })
}
