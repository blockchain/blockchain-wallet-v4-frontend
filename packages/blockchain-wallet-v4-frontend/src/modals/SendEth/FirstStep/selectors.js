import { prop, propOr, isEmpty } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendEth.getPayment,
    selectors.components.sendEth.getToToggled,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.form.getFormValues('sendEth')
  ],
  (paymentR, toToggled, lockboxDevicesR, formValues) => {
    const enableToggle = !isEmpty(lockboxDevicesR.getOrElse({}))

    const transform = payment => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const isContract = prop('isContract', payment)
      const fee = propOr('0', 'fee', payment)
      const destination = prop('to', formValues)

      return {
        effectiveBalance,
        unconfirmedTx,
        isContract,
        toToggled,
        enableToggle,
        destination,
        fee
      }
    }
    return paymentR.map(transform)
  }
)
