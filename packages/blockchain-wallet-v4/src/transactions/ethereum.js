import { curry, contains, equals, map, toLower } from 'ramda'
import memoize from 'fast-memoize'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { getEthereumTxNote } from '../redux/kvStore/ethereum/selectors.js'

// getType :: TX -> [String] -> String
const getType = (tx, addresses) => {
  const lowerAddresses = map(toLower, addresses)
  switch (true) {
    case contains(tx.from, lowerAddresses) && contains(tx.to, lowerAddresses): return 'Transferred'
    case contains(tx.from, lowerAddresses): return 'Sent'
    case contains(tx.to, lowerAddresses): return 'Received'
    default: return 'Unknown'
  }
}

export const getConfirmations = (blockNumber, latestBlockHeight) => {
  const conf = latestBlockHeight - blockNumber + 1
  return conf > 0 ? conf : 0
}

export const getTime = tx => {
  const date = moment.utc(tx.timeStamp * 1000)
  return equals(date.year(), moment().year())
    ? date.format('MMMM D @ h:mm A')
    : date.format('MMMM D YYYY @ h:mm A')
}

export const getFee = tx => {
  return new BigNumber(tx.gasPrice).mul(tx.gasUsed || tx.gas).toString()
}

export const _transformTx = curry((addresses, latestBlock, state, tx) => ({
  type: toLower(getType(tx, addresses)),
  hash: tx.hash,
  amount: parseInt(tx.value),
  to: tx.to,
  from: tx.from,
  confirmations: getConfirmations(tx.blockNumber, latestBlock),
  fee: getFee(tx),
  description: getEthereumTxNote(state, tx.hash).data || '',
  time: tx.timeStamp,
  timeFormatted: getTime(tx)
}))

export const transformTx = memoize(_transformTx)
