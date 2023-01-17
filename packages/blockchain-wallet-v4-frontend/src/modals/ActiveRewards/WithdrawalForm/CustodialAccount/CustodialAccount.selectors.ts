import { selectors } from 'data'

export const getData = () => ({
  coins: selectors.core.data.coins.getCoins()
})
