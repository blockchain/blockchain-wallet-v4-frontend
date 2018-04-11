import { lift } from 'ramda'
import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const defaultAccountAddressR = selectors.core.kvStore.ethereum.getContext(state)
  const balanceR = selectors.core.data.ethereum.getBalance(state)
  const feeRegularR = selectors.core.data.ethereum.getFeeRegular(state)
  const gasLimitR = selectors.core.data.ethereum.getGasLimit(state)
  const coin = formValueSelector('sendEther')(state, 'coin')
  const fee = formValueSelector('sendEther')(state, 'fee')

  const transform = (defaultAccountAddress, balance, feeRegular, gasLimit) => {
    const dataFeeEther = utils.ethereum.calculateBalanceEther(feeRegular, gasLimit, balance)
    const dataFeeWei = utils.ethereum.calculateBalanceWei(feeRegular, gasLimit, balance)

    return {
      initialValues: { coin: 'ETH', fee: dataFeeWei.fee, from: defaultAccountAddress },
      coin,
      fee,
      effectiveBalance: dataFeeEther.effectiveBalance
    }
  }

  return lift((defaultAccountAddress, balance, feeRegular, gasLimit) =>
    transform(defaultAccountAddress, balance, feeRegular, gasLimit))(defaultAccountAddressR, balanceR, feeRegularR, gasLimitR)
}
