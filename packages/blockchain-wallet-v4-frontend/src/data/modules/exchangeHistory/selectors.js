import { curry, isEmpty, length, lift, map, path, prop, slice } from 'ramda'
import moment from 'moment'
import { Remote } from 'blockchain-wallet-v4/src'
import * as selectors from './../../selectors'

export const getExchangeHistory = curry((state, page) => {
  const tradesR = selectors.core.kvStore.shapeShift.getTrades(state)
  const tradesStatusR = selectors.core.data.shapeShift.getTrades(state)

  console.log(tradesR)
  console.log(tradesStatusR)

  const f = (trades, tradesStatus) => {
    // if (isEmpty(tradesStatus)) return Remote.NotAsked([])
    const tradesTotal = length(trades) || 0
    const tradesPage = slice((page - 1) * 10, page * 10 - 1, trades)

    const details = (trade, tradesStatus) => {
      const address = path(['quote', 'deposit'], trade)
      const status = prop(address, tradesStatus)
      return {
        address,
        date: moment(prop('timestamp', trade)).format('DD MMMM YYYY, HH:mm'),
        status: prop('status', trade),
        incomingCoin: prop('incomingCoin', status),
        incomingType: prop('incomingType', status),
        outgoingCoin: prop('outgoingCoin', status),
        outgoingType: prop('outgoingType', status)
      }
    }

    return {
      trades: trades ? map(x => details(x, tradesStatus), tradesPage) : [],
      tradesTotal
    }
  }

  return lift(f)(tradesR, tradesStatusR)
})

export const getDepositAddresses = curry((state, page) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const tradesPage = slice((page - 1) * 10, page * 10 - 1, trades)
  return map(x => path(['quote', 'deposit'], x), tradesPage)
})
