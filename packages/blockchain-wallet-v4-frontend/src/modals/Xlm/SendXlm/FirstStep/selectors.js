import { prop, propOr, lift, isEmpty } from 'ramda'
import { model, selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendXlm.getPayment,
    selectors.components.sendXlm.getToToggled,
    selectors.core.data.xlm.getTotalBalance,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCurrency,
    selectors.core.data.xlm.getRates,
    selectors.form.getFormValues(model.components.sendXlm.FORM),
    selectors.form.getActiveField(model.components.sendXlm.FORM),
    selectors.components.sendXlm.showNoAccountForm,
    selectors.core.walletOptions.getCoinAvailability
  ],
  (
    paymentR,
    toToggled,
    balanceR,
    lockboxDevicesR,
    currencyR,
    ratesR,
    formValues,
    activeField,
    noAccount,
    getCoinAvailability
  ) => {
    const enableToggle = !isEmpty(lockboxDevicesR.getOrElse([]))
    const excludeLockbox = !getCoinAvailability('XLM')
      .map(propOr(true, 'lockbox'))
      .getOrElse(true)

    const transform = (payment, currency, rates) => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const reserve = propOr('0', 'reserve', payment)
      const destinationAccountExists = propOr(
        false,
        'destinationAccountExists',
        payment
      )
      const fee = propOr('0', 'fee', payment)
      const destination = prop('to', formValues)
      const from = prop('from', formValues)

      return {
        activeField,
        effectiveBalance,
        fee,
        toToggled,
        enableToggle,
        destination,
        from,
        reserve,
        currency,
        rates,
        destinationAccountExists,
        balanceStatus: balanceR,
        noAccount,
        excludeLockbox
      }
    }
    return lift(transform)(paymentR, currencyR, ratesR)
  }
)
