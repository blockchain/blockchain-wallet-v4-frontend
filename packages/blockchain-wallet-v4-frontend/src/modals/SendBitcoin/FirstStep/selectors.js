import { equals, prop, path } from 'ramda'
import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const toToggled = selectors.components.sendBtc.getToToggled(state)
  const feePerByteToggled = selectors.components.sendBtc.getFeePerByteToggled(state)
  const paymentR = selectors.components.sendBtc.getPayment(state)

  const transform = payment => {
    const regularFeePerByte = path(['fees', 'regular'], payment)
    const priorityFeePerByte = path(['fees', 'priority'], payment)
    const minFeePerByte = path(['fees', 'limits', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    const feePerByteElements = [{ group: '', items: [{ text: 'Regular', value: regularFeePerByte }, { text: 'Priority', value: priorityFeePerByte }] }]
    const feePerByte = formValueSelector('sendBtc')(state, 'feePerByte')
    const isPriorityFeePerByte = equals(parseInt(feePerByte), priorityFeePerByte)

    return {
      toToggled,
      feePerByteToggled,
      feePerByteElements,
      effectiveBalance,
      minFeePerByte,
      maxFeePerByte,
      regularFeePerByte,
      priorityFeePerByte,
      isPriorityFeePerByte
    }
  }

  return paymentR.map(transform)
}
