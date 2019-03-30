import { model, selectors } from 'data'
import { path, propOr, toUpper } from 'ramda'

const { COIN_MODELS } = model.coins

export const getDomains = state =>
  selectors.core.walletOptions.getDomains(state).getOrElse(false)

export const getCanAirdrop = (state, ownProps) => {
  const { coin } = ownProps
  const userData = selectors.modules.profile.getUserData(state).getOrElse({})
  return (
    path([coin, 'airdrop'], COIN_MODELS) &&
    !path(['tags', path([coin, 'airdrop', 'name'], COIN_MODELS)], userData)
  )
}

export const getCanBuyBtc = (state, ownProps) => {
  const { coin } = ownProps
  const canTrade = selectors.exchange.getCanTrade(state, 'Buy').getOrElse(false)
  return coin === 'BTC' && canTrade
}

export const getAvailability = (state, ownProps) => {
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    toUpper(ownProps.coin)
  )
  return {
    exchange: availability.map(propOr(true, 'exchange')).getOrElse(false),
    request: availability.map(propOr(true, 'request')).getOrElse(false)
  }
}
