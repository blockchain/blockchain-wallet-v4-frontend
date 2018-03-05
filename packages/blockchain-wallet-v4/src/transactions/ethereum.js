import { contains, map, toLower } from 'ramda'
import EthereumTx from 'ethereumjs-tx'
import EthereumUtil from 'ethereumjs-util'
import EthereumWallet from 'ethereumjs-wallet'

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

export const calculateFee = (gasRegular, gasLimit) => `${(gasRegular * gasLimit)}000000000` // Convert gwei => wei

export const createTx = (fromAccount, toAddress, amount, gasPrice, gasLimit, network = 1) => {
  let tx
  try {
    tx = new EthereumTx(null, network)
    tx.nonce = fromAccount.nonce
    // let feeBN =

    // return {
    //   account: account.addr,
    //   _tx: ,
    //   _fee: '',
    //   _amount: '',
    //   _available: ''
    // }
  } catch (e) {
    console.log(e)
  }
  return tx
}

export const signTx = (transaction, ptrivateKey) => {

}

// transformTx :: [String] -> Tx -> ProcessedTx
export const transformTx = (addresses, tx) => ({
  type: getType(tx, addresses),
  amount: parseInt(tx.value),
  to: tx.to,
  from: tx.from,
  description: tx.description || '',
  time: tx.timeStamp,
  status: ''
})
