import { Exchange } from 'blockchain-wallet-v4/src'
import BigNumber from 'bignumber.js'

export const maximumAmount = (value, allValues, props) => {
  const valueWei = Exchange.convertEtherToEther({ value, fromUnit: 'ETH', toUnit: 'WEI' }).value
  const effectiveBalanceEth = Exchange.convertEtherToEther({ value: props.effectiveBalance, fromUnit: 'WEI', toUnit: 'ETH' }).value
  return new BigNumber(valueWei).lessThanOrEqualTo(props.effectiveBalance) ? undefined : `Use total available minus fee: ${effectiveBalanceEth} ETH.`
}
