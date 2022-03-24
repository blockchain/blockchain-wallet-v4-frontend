import { FiatType } from '@core/types'

export type UseFormatFiatArgs = {
  currency: FiatType
  value: number
}

export type UseFormatFiatComponent = (args: UseFormatFiatArgs) => string
