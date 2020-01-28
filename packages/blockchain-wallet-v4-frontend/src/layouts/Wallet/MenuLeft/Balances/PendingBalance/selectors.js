import { add, filter, pathOr, reduce } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const isBuyProcessing = trade => trade.isBuy && trade.state === 'processing'

const extractPendingBalance = trades => {
  const pendingBuyTrades = filter(isBuyProcessing, trades)
  const pendingAmounts = pendingBuyTrades.map(x =>
    pathOr(0, ['receiveAmount'], x)
  )
  return Exchange.convertBtcToBtc({
    value: reduce(add, 0, pendingAmounts),
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
}

export const getData = state => {
  const tradesR = selectors.core.data.sfox.getTrades(state)
  return tradesR.map(extractPendingBalance)
}
