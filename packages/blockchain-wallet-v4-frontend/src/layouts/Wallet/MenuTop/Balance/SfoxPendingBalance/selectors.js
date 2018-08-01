import { selectors } from 'data'
import { add, filter, reduce, pathOr } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

const isBuyProcessing = trade => trade.isBuy && trade.state === 'processing'

const extractPendingBalance = trades => {
  const pendingBuyTrades = filter(isBuyProcessing, trades)
  const pendingAmounts = pendingBuyTrades.map(x =>
    pathOr(0, ['receiveAmount'], x)
  )
  return Exchange.convertBitcoinToBitcoin({
    value: reduce(add, 0, pendingAmounts),
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
}

export const getData = state => {
  const tradesR = selectors.core.data.sfox.getTrades(state)
  return tradesR.map(extractPendingBalance)
}
