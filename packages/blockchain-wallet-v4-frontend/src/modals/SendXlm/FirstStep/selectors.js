import { prop, propOr, isEmpty } from 'ramda'
import { model, selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendXlm.getPayment,
    selectors.components.sendXlm.getToToggled,
    selectors.core.data.xlm.getTotalBalance,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.form.getFormValues(model.components.sendXlm.FORM),
    selectors.components.sendXlm.showNoAccountForm
  ],
  (paymentR, toToggled, balanceR, lockboxDevicesR, formValues, noAccount) => {
    const enableToggle = !isEmpty(lockboxDevicesR.getOrElse([]))

    const transform = payment => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const reserve = propOr('0', 'reserve', payment)
      const destinationAccountExists = propOr(
        false,
        'destinationAccountExists',
        payment
      )
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const isContract = prop('isContract', payment)
      const fee = propOr('0', 'fee', payment)
      const destination = prop('to', formValues)
      const from = prop('from', formValues)

      return {
        effectiveBalance,
        unconfirmedTx,
        isContract,
        fee,
        toToggled,
        enableToggle,
        destination,
        from,
        reserve,
        destinationAccountExists,
        balanceStatus: balanceR,
        noAccount
      }
    }
    return paymentR.map(transform)
  }
)
