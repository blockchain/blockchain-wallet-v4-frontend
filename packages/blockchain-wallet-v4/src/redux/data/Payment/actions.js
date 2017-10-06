import * as AT from './actionTypes'

export const setUnspent = (coins) => ({ type: AT.SET_UNSPENT, payload: { coins } })

export const setEffectiveBalance = (effectiveBalance) => ({ type: AT.SET_EFFECTIVE_BALANCE, payload: { effectiveBalance } })

export const setSelection = (feePerByte, target, coins, change, algorithm, seed) =>
({ type: AT.SET_SELECTION, payload: {feePerByte, target, coins, change, algorithm, seed} })
