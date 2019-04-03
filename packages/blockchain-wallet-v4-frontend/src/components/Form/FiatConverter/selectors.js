import { model, selectors } from 'data'
import { includes, lift, toLower } from 'ramda'

const { ERC20_COIN_LIST } = model.coins
export const getData = (state, ownProps) => {
  const { coin } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  let ratesR

  if (includes(coin, ERC20_COIN_LIST)) {
    ratesR = selectors.core.data.eth.getErc20Rates(state, toLower(coin))
  } else {
    ratesR = selectors.core.data[toLower(coin)].getRates(state)
  }

  const transform = (currency, rates) => ({
    unit: coin,
    currency,
    rates
  })

  return lift(transform)(currencyR, ratesR)
}
