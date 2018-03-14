import * as AT from './actionTypes'

export const setBitcoinFee = (data) => ({ type: AT.SET_BITCOIN_FEE, payload: data })

export const setBitcoinLatestBlock = (block_index, hash, height, time) => ({ type: AT.SET_BITCOIN_LATEST_BLOCK, payload: { block_index, hash, height, time } })

export const setBitcoinUnspent = (coins) => ({ type: AT.SET_BITCOIN_UNSPENT, payload: { coins } })

export const setBitcoinEffectiveBalance = (effectiveBalance) => ({ type: AT.SET_BITCOIN_EFFECTIVE_BALANCE, payload: { effectiveBalance } })

export const setBitcoinSelection = (feePerByte, target, coins, change, algorithm, seed) => ({ type: AT.SET_BITCOIN_SELECTION, payload: { feePerByte, target, coins, change, algorithm, seed } })

export const setBitcoinRates = (data) => ({ type: AT.SET_BITCOIN_RATES, payload: data })

export const setBitcoinFiatAtTime = (coin, currency, hash, value) => ({ type: AT.SET_BITCOIN_FIAT_AT_TIME, payload: { coin, currency, hash, value } })

export const setBitcoinTransactions = (address, txs, reset) => ({ type: AT.SET_BITCOIN_TRANSACTIONS, payload: { address, txs, reset } })

export const pushTx = (txHex) => ({type: AT.PUSH_TX, payload: {txHex}})
