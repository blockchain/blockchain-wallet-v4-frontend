import { lift } from 'ramda'

import { CoinType, ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { getBalanceSelector } from 'components/Balances/nonCustodial/selectors'
import { selectors } from 'data'

export const getBalance = state => {
  const offersR = selectors.components.borrow.getOffers(state)
  const values = selectors.form.getFormValues('initBorrow')(state) as {
    coin: CoinType
  }
  const balanceSelector = getBalanceSelector(values.coin)
  const balanceR = balanceSelector(state)

  const ratesR = selectors.core.data.misc.getRatesSelector(values.coin, state)

  const transform = (
    offers: ExtractSuccess<typeof offersR>,
    balance: number,
    rates: ExtractSuccess<typeof ratesR>
  ) => {
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
