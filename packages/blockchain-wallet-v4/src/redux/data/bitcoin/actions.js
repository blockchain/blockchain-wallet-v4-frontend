import * as AT from './actionTypes'

export const setBitcoinFee = (data) => ({ type: AT.SET_BITCOIN_FEE, payload: data })

export const setBitcoinLatestBlock = (block_index, hash, height, time) => ({ type: AT.SET_BITCOIN_LATEST_BLOCK, payload: { block_index, hash, height, time } })

export const setBitcoinUnspent = (coins) => ({ type: AT.SET_BITCOIN_UNSPENT, payload: { coins } })

export const setBitcoinEffectiveBalance = (effectiveBalance) => ({ type: AT.SET_BITCOIN_EFFECTIVE_BALANCE, payload: { effectiveBalance } })

export const setBitcoinSelection = (feePerByte, target, coins, change, algorithm, seed) => ({ type: AT.SET_BITCOIN_SELECTION, payload: { feePerByte, target, coins, change, algorithm, seed } })

export const setBitcoinFiatAtTime = (coin, currency, hash, value) => ({ type: AT.SET_BITCOIN_FIAT_AT_TIME, payload: { coin, currency, hash, value } })

export const setBitcoinTransactions = (address, txs, reset) => ({ type: AT.SET_BITCOIN_TRANSACTIONS, payload: { address, txs, reset } })


export const fetchRates = () => ({ type: AT.FETCH_BITCOIN_RATES })

export const fetchRatesSuccess = (data) => ({ type: AT.FETCH_BITCOIN_RATES_SUCCESS, payload: data })

export const fetchRatesFailure = (error) => ({ type: AT.FETCH_BITCOIN_RATES_FAILURE, payload: error })
