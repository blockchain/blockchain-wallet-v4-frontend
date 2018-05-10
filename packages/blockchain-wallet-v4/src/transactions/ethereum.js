import { contains, equals, map, toLower } from 'ramda'
import moment from 'moment'
import BigNumber from 'bignumber.js'

// import EthereumTx from 'ethereumjs-tx'
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

// transformTx :: [String] -> Tx -> ProcessedTx
export const transformTx = (addresses, state, latestBlock, tx) => {
  const conf = latestBlock - tx.blockNumber + 1
  const confirmations = conf > 0 ? conf : 0
  const formattedDate = time => {
    const date = moment.utc(time * 1000)

    return equals(date.year(), moment().year())
      ? date.format('MMMM D @ h:mm A')
      : date.format('MMMM D YYYY @ h:mm A')
  }

  return ({
    type: toLower(getType(tx, addresses)),
    hash: tx.hash,
    amount: parseInt(tx.value),
    to: tx.to,
    from: tx.from,
    confirmations: confirmations,
    fee: new BigNumber(tx.gasPrice).mul(tx.gasUsed || tx.gas).toString(),
    description: getEthereumTxNote(state, tx.hash).data || '',
    time: tx.timeStamp,
    timeFormatted: formattedDate(tx.timeStamp),
    status: ''
  })
}
