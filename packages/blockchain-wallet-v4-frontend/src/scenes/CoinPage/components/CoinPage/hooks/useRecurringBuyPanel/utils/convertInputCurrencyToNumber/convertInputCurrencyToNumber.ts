import { FiatType } from '@core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

export const convertInputCurrencyToNumber = (currency: FiatType, value: string): number => {
  return parseFloat(convertBaseToStandard(currency, value))
}
