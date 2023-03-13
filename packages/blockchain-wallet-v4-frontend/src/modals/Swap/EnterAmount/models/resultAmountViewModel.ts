import { formatCoin } from '@core/exchange/utils'
import { CoinfigType, RemoteDataType } from '@core/types'
import { QuotePrice } from 'data/components/swap/types'

export const make = (
  quotePrice: RemoteDataType<unknown, QuotePrice>,
  counterCoinfig: CoinfigType
) => {
  const { displaySymbol } = counterCoinfig
  const defaultText = `0 ${displaySymbol}`

  return quotePrice
    .map(({ data, isPlaceholder, isRefreshing }) => {
      if (isPlaceholder) {
        return {
          isRefreshing,
          text: defaultText
        }
      }

      return {
        isRefreshing,
        text: `${formatCoin(data.resultAmount)} ${displaySymbol}`
      }
    })
    .getOrElse({
      isRefreshing: false,
      text: defaultText
    })
}
