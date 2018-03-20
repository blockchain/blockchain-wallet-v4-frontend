import { selectAll } from '../coinSelection'
import { head, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import * as Exchange from '../exchange'

export const calculateBalanceSatoshi = (coins, feePerByte) => {
  const { outputs, fee } = selectAll(feePerByte, coins)
  const effectiveBalance = prop('value', head(outputs)) || 0
  const balance = new BigNumber(effectiveBalance).add(new BigNumber(fee))
  return { balance, fee, effectiveBalance }
}

export const calculateBalanceBitcoin = (coins, feePerByte) => {
  const data = calculateBalanceSatoshi(coins, feePerByte)
  return {
    balance: Exchange.convertBitcoinToBitcoin({ value: data.balance, fromUnit: 'SAT', toUnit: 'BTC' }).value,
    fee: Exchange.convertBitcoinToBitcoin({ value: data.fee, fromUnit: 'SAT', toUnit: 'BTC' }).value,
    effectiveBalance: Exchange.convertBitcoinToBitcoin({ value: data.effectiveBalance, fromUnit: 'SAT', toUnit: 'BTC' }).value
  }
}
