import { equals, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import { Remote, utils } from 'blockchain-wallet-v4/src'

export const isAboveShapeshiftMinimum = (value, allValues, props) => {
  // console.log('isAboveShapeshitMimimum', value, allValues, props)
  const sourceCoin = prop('sourceCoin', props)
  const targetCoin = prop('targetCoin', props)
  const source = prop('source', value)
  const btcEthMinimum = path(['btcEth', 'minimum'], props)
  const ethBtcMinimum = path(['ethBtc', 'minimum'], props)
  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) {
    if (new BigNumber(source).lessThan(new BigNumber(btcEthMinimum))) return `Value is below the minimum limit (${btcEthMinimum})`
  }
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) {
    if (new BigNumber(source).lessThan(new BigNumber(ethBtcMinimum))) return `Value is below the minimum limit (${ethBtcMinimum})`
  }
  return undefined
}

export const isBelowShapeshiftMaximum = (value, allValues, props) => {
  // console.log('isBelowShapeshiftMaximum', value, allValues, props)
  const sourceCoin = prop('sourceCoin', props)
  const targetCoin = prop('targetCoin', props)
  const source = prop('source', value)
  const btcEthMaximum = path(['btcEth', 'limit'], props)
  const ethBtcMaximum = path(['ethBtc', 'limit'], props)
  if (equals('BTC', sourceCoin) && equals('ETH', targetCoin)) {
    if (new BigNumber(source).greaterThan(new BigNumber(btcEthMaximum))) return `Value is above the maximum limit (${btcEthMaximum})`
  }
  if (equals('ETH', sourceCoin) && equals('BTC', targetCoin)) {
    if (new BigNumber(source).greaterThan(new BigNumber(ethBtcMaximum))) return `Value is above the maximum limit (${ethBtcMaximum})`
  }
  return undefined
}

export const isBelowEffectiveBalance = (value, allValues, props) => {
  // console.log('isBelowEffectiveBalance', value, props)
  const source = prop('source', value)
  const effectiveBalance = props.effectiveBalance
  return new BigNumber(source).lessThanOrEqualTo(new BigNumber(effectiveBalance)) ? undefined : `Value is above your account effective balance (${effectiveBalance})`
}

export const calculateEffectiveBalance = (props) => {
  if (!Remote.Success.is(props.data)) return 0

  const { sourceCoin, accounts, coins, ethAddresses, data } = props
  switch (sourceCoin) {
    case 'BTC':
      const { btcFee } = data.getOrElse({ btcFee: { priority: 0 } })
      return utils.bitcoin.calculateEffectiveBalanceBitcoin(coins, btcFee.priority)
    case 'ETH':
      const ethAccount = path(['source', 'address'], accounts)
      const { ethFee } = data.getOrElse({ ethFee: { priority: 0, gasLimit: 21000 } })
      const ethBalance = path([ethAccount, 'balance'], ethAddresses)
      return utils.ethereum.calculateEffectiveBalanceEther(ethFee.priority, ethFee.gasLimit, ethBalance)
  }
}
