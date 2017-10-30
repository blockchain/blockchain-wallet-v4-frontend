import { contains, map, toLower } from 'ramda'

const getType = (tx, addresses) => {
  const lowerAddresses = map(toLower, addresses)
  switch (true) {
    case contains(tx.from, lowerAddresses) && contains(tx.to, lowerAddresses): return 'Transferred'
    case contains(tx.from, lowerAddresses): return 'Sent'
    case contains(tx.to, lowerAddresses): return 'Received'
    default: return 'Unknown'
  }
}

export const transformEthereumTx = (addresses, tx) => ({
  type: getType(tx, addresses),
  amount: parseInt(tx.value),
  to: tx.to,
  from: tx.from,
  description: tx.description || '',
  time: tx.timeStamp,
  status: ''
})
