import { CoinType, OfferType } from 'core/types'
import { getBalanceSelector } from 'components/Balances/wallet/selectors'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getBalance = state => {
  const offersR = selectors.components.borrow.getOffers(state)
  const values = selectors.form.getFormValues('initBorrow')(state) as {
    coin: CoinType
  }
  const balanceSelector = getBalanceSelector(values.coin)
  const balanceR = balanceSelector(state)

  const ratesR = selectors.core.data.misc.getRatesSelector(values.coin, state)

  const transform = (offers: Array<OfferType>, balance, rates) => {
    const offer = offers.find(
      offer => offer.terms.collateralCcy === values.coin
    )
    const max = offer ? balance / offer.terms.collateralRatio : balance

    return {
      values,
      offers,
      rates,
      offer,
      balance,
      max
    }
  }

  return lift(transform)(offersR, balanceR, ratesR)
}
