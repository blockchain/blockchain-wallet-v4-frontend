import { CoinType } from '@core/types'

export type ErrorMessageProps = {
  coin?: CoinType
  error: string
  isInsufficientBalance: boolean
}
