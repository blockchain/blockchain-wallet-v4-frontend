import { contains, map, toLower } from 'ramda'
import EthereumTx from 'ethereumjs-tx'
import EthereumUtil from 'ethereumjs-util'
import EthereumWallet from 'ethereumjs-wallet'

const getType = (tx, addresses) => {
  const lowerAddresses = map(toLower, addresses)
  switch (true) {
    case contains(tx.from, lowerAddresses) && contains(tx.to, lowerAddresses): return 'Transferred'
    case contains(tx.from, lowerAddresses): return 'Sent'
    case contains(tx.to, lowerAddresses): return 'Received'
    default: return 'Unknown'
  }
}

export const calculateFee = (gasRegular, gasLimit) => `${(gasRegular * gasLimit)}000000000` // Convert gwei => wei

export const createTx = (account, network = 1) => {
  let tx = new EthereumTx(null, network)
  console.log(tx)
  // tx.nonce = account.nonce

  // let feeBN = 

  // return {
  //   account: account.addr,
  //   _tx: ,
  //   _fee: '',
  //   _amount: '',
  //   _available: ''
  // }
  return ''
}

export const signTx = (transaction, ptrivateKey) => {

}

export const transformTx = (addresses, tx) => ({
  type: getType(tx, addresses),
  amount: parseInt(tx.value),
  to: tx.to,
  from: tx.from,
  description: tx.description || '',
  time: tx.timeStamp,
  status: ''
})
