import * as AT from './actionTypes'

export const setFee = (data) => ({ type: AT.SET_FEE, payload: data })

export const deleteFee = () => ({ type: AT.DELETE_FEE })

export const setLatestBlock = (block_index, hash, height, time) => ({ type: AT.SET_LATEST_BLOCK, payload: { block_index, hash, height, time } })

export const setUnspent = (coins) => ({ type: AT.SET_UNSPENT, payload: { coins } })

export const setEffectiveBalance = (effectiveBalance) => ({ type: AT.SET_EFFECTIVE_BALANCE, payload: { effectiveBalance } })

export const setSelection = (feePerByte, target, coins, change, algorithm, seed) =>
  ({ type: AT.SET_SELECTION, payload: { feePerByte, target, coins, change, algorithm, seed } })

export const setBitcoinRates = (data) => ({ type: AT.SET_BITCOIN_RATES, payload: data })

export const setTransactionFiatAtTime = (coin, currency, hash, value) => ({ type: AT.SET_TRANSACTION_FIAT_AT_TIME, payload: { coin, currency, hash, value } })

export const setBitcoinTransactions = (address, txs, reset) => ({ type: AT.SET_BITCOIN_TRANSACTIONS, payload: { address, txs, reset } })
