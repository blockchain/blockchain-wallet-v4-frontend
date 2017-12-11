import { curry, isEmpty, length, map, path, prop, slice } from 'ramda'
import moment from 'moment'
import * as selectors from './../../selectors'

export const getExchangeHistory = curry((state, page) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const tradesStatus = selectors.core.data.shapeShift.getTradesStatus(state)
  if (isEmpty(tradesStatus)) return { data: [], state: 'NotAsked' }

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
    data: map(x => details(x, tradesStatus), tradesPage)
  }
})

export const getDepositAddresses = curry((state, page) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const tradesPage = slice((page - 1) * 10, page * 10 - 1, trades)
  return map(x => path(['quote', 'deposit'], x), tradesPage)
})

export const getTradesTotal = state => length(selectors.core.kvStore.shapeShift.getTrades(state)) || 0
