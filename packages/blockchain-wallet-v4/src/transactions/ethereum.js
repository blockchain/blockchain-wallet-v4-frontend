import { contains, map, toLower } from 'ramda'
import EthereumTx from 'ethereumjs-tx'
import {getEthereumTxNote } from '../redux/kvStore/ethereum/selectors.js'

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

export const calculateFee = (gasPrice, gasLimit) => `${(gasPrice * gasLimit)}000000000` // Convert gwei => wei

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
export const transformTx = (addresses, state, tx) => ({
  type: getType(tx, addresses),
  hash: tx.hash,
  amount: parseInt(tx.value),
  to: tx.to,
  from: tx.from,
  description: getEthereumTxNote(state, tx.hash).data || '',
  time: tx.timeStamp,
  status: ''
})
