import { lift, prop, path, contains } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { currencySymbolMap } from 'services/CoinifyService'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.coinify.getLimits,
    selectors.core.data.coinify.getMediums,
    selectors.core.data.coinify.getQuote
  ],
  (limitsR, mediumsR, quoteR) => {
    const isMediumDisabled = (quote, mediums, limits) => {
      const fiatAmount =
        quote.quoteCurrency === 'BTC'
          ? Math.abs(quote.baseAmount)
          : Math.abs(quote.quoteAmount)
      const fiatCurrency =
        quote.quoteCurrency === 'BTC' ? quote.baseCurrency : quote.quoteCurrency

      const getMax = medium =>
        path(['limitInAmounts', fiatCurrency], prop(medium, mediums))
      const getMin = medium =>
        path(['minimumInAmounts', fiatCurrency], prop(medium, mediums))

      const createLimitError = (medium, type) => ({
        medium,
        type,
        limit: `${currencySymbolMap[fiatCurrency]}${
          contains('over', type) ? getMax(medium) : getMin(medium)
        }`
      })

      const createGenericError = medium => ({
        medium,
        error: path([medium, 'cannotTradeReason'], mediums)
      })

      const checkForLimitError = medium => {
        if (!path([medium, 'canTrade'], mediums))
          return createGenericError(medium)
        if (fiatAmount > getMax(medium))
          return createLimitError(medium, `over_${medium}`)
        if (fiatAmount < getMin(medium))
          return createLimitError(medium, `under_${medium}`)
        return false
      }

      const cardDisabled = checkForLimitError('card')
      const bankDisabled = checkForLimitError('bank')

      return cardDisabled || bankDisabled
    }

    const transform = (limits, mediums, quote) => {
      const disabledMedium = isMediumDisabled(quote, mediums, limits)
      return {
        limits,
        mediums,
        quote,
        disabledMedium
      }
    }
    return lift(transform)(limitsR, mediumsR, quoteR)
  }
)

export const getQuote = createDeepEqualSelector(
  [selectors.core.data.coinify.getQuote],
  quoteR => {
    const transform = quote => quote
    return lift(transform)(quoteR)
  }
)
