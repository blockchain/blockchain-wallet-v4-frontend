import { equals, isEmpty, isNil, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'
// import { utils } from 'blockchain-wallet-v4/src'

export const isRequired = (value) => !isEmpty(prop('source', value)) ? undefined : 'Invalid amount'

export const isAboveZero = (value) => value.source !== '' && new BigNumber(value.source).greaterThan('0') ? undefined : 'Invalid amount'

export const isAboveShapeshiftMinimum = (value, allValues, props) => {
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
  const source = prop('source', value)
  const effectiveBalance = props.effectiveBalance
  return new BigNumber(source).lessThanOrEqualTo(new BigNumber(effectiveBalance)) ? undefined : `Value is above your account effective balance (${effectiveBalance})`
}

// export const calculateEffectiveBalance = (props) => {
//   const { sourceCoin, accounts, coins, ethAddresses, btcFee, ethFee } = props
//   switch (sourceCoin) {
//     case 'BTC':
//       return utils.bitcoin.calculateFeeAndEffectiveBalanceBitcoin(coins, btcFee.priority)
//     case 'ETH':
//       const ethAccount = path(['source', 'address'], accounts)
//       const ethBalance = path([ethAccount, 'balance'], ethAddresses)
//       return utils.ethereum.calculateFeeAndEffectiveBalanceEther(ethFee.priority, ethFee.gasLimit, ethBalance)
//   }
// }

export const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  return initialRender ||
         !isNil(nextProps.values) ||
         !structure.deepEqual(props.values, nextProps.values)
}
