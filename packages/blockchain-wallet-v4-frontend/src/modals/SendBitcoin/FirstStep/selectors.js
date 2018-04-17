import { prop, path } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const toToggled = selectors.components.sendBtc.getToToggled(state)
  const feePerByteToggled = selectors.components.sendBtc.getFeePerByteToggled(state)
  const captureToggled = selectors.components.sendBtc.getCaptureToggled(state)
  const paymentR = selectors.components.sendBtc.getPayment(state)

  const transform = payment => {
    const regular = path(['fees', 'regular'], payment)
    const priority = path(['fees', 'priority'], payment)
    const minFeePerByte = path(['fees', 'limit', 'min'], payment)
    const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
    const effectiveBalance = prop('effectiveBalance', payment)
    const feePerByteElements = [{ group: '', items: [{ text: 'Regular', value: regular }, { text: 'Priority', value: priority }] }]

    return {
      toToggled,
      feePerByteToggled,
      captureToggled,
      feePerByteElements,
      effectiveBalance,
      minFeePerByte,
      maxFeePerByte
    }
  }

  return paymentR.map(transform)
}
