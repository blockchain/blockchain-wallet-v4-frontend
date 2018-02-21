import { concat, lift } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => Remote.of('lol') // selectors.core.data.bitcoin.getCoins(state)
