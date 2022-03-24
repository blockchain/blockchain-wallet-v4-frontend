import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { UseCurrency } from './types'

export const useCurrency: UseCurrency = () => {
  return useSelector((state) => {
    return selectors.core.settings.getCurrency(state).getOrElse('USD')
  })
}
