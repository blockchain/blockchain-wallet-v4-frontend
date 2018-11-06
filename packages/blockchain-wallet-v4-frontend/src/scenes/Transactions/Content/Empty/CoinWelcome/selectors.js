import { selectors } from 'data'
import { coinProps } from './model'
import { path } from 'ramda'

export const getDomains = state =>
  selectors.core.walletOptions.getDomains(state).getOrElse(false)

export const getCanAirdrop = (state, ownProps) => {
  const { coin } = ownProps
  const userData = selectors.modules.profile.getUserData(state).getOrElse({})
  return (
    path([coin, 'airdrop'], coinProps) &&
    !path(['tags', path([coin, 'airdrop', 'name'], coinProps)], userData)
  )
}

export const getCanBuyBtc = (state, ownProps) => {
  const { coin } = ownProps
  const canTrade = selectors.exchange.getCanTrade(state, 'Buy').getOrElse(false)
  return coin === 'BTC' && canTrade
}
