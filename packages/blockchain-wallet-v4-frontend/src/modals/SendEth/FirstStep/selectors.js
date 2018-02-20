import { lift } from 'ramda'
import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { Exchange, transactions } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const defaultAccountAddressR = selectors.core.kvStore.ethereum.getContext(state)
  const balanceR = selectors.core.data.ethereum.getBalance(state)
  const feeRegularR = selectors.core.data.ethereum.getFeeRegular(state)
  const gasLimitR = selectors.core.data.ethereum.getGasLimit(state)
  const coin = formValueSelector('sendEth')(state, 'coin')
  const fee = formValueSelector('sendEth')(state, 'fee')

  const transform = (defaultAccountAddress, balance, feeRegular, gasLimit) => {
    const transactionFee = transactions.ethereum.calculateFee(feeRegular, gasLimit)
    const effectiveBalanceWei = balance - transactionFee
    const effectiveBalance = Exchange.convertEtherToEther({ value: effectiveBalanceWei, fromUnit: 'WEI', toUnit: 'ETH' }).value

    return {
      initialValues: { coin: 'ETH', fee: transactionFee, from: defaultAccountAddress },
      coin,
      fee,
      effectiveBalanceWei,
      effectiveBalance
    }
  }

  return lift((defaultAccountAddress, balance, feeRegular, gasLimit) =>
    transform(defaultAccountAddress, balance, feeRegular, gasLimit))(defaultAccountAddressR, balanceR, feeRegularR, gasLimitR)
}
