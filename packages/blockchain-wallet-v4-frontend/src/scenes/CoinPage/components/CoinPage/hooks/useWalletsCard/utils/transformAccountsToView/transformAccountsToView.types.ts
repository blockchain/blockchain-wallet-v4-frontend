import { FiatType, RatesType } from '@core/types'

export type TransformAccountsToViewData = {
  totalCrypto: string
  totalFiat: string
}

export type TransformAccountsToViewUtilProps = {
  coin: string
  currency: FiatType
  rates: RatesType
  value: number
}

export type TransformAccountsToViewUtil = (
  props: TransformAccountsToViewUtilProps
) => TransformAccountsToViewData
