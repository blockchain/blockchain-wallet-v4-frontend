import { lift, prop, propOr } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { model, selectors } from 'data'

const getData = createDeepEqualSelector(
  [
    selectors.components.sendXlm.getPayment,
    selectors.components.sendXlm.getCheckDestination,
    selectors.components.sendXlm.getIsDestinationExchange,
    selectors.core.data.xlm.getTotalBalance,
    selectors.core.settings.getCurrency,
    selectors.core.wallet.isMnemonicVerified,
    selectors.form.getFormValues(model.components.sendXlm.FORM),
    selectors.form.getActiveField(model.components.sendXlm.FORM),
    selectors.components.sendXlm.showNoAccountForm,
    (state) => selectors.core.data.coins.getRates('XLM', state)
  ],
  (
    paymentR,
    checkDestinationR,
    isDestinationExchangeR,
    balanceR,
    currencyR,
    isMnemonicVerified,
    formValues,
    activeField,
    noAccount,
    ratesR
  ) => {
    const amount = prop('amount', formValues)
    const destination = prop('to', formValues)
    const from = prop('from', formValues)
    const isDestinationExchange = isDestinationExchangeR.getOrElse(false)

    const transform = (payment, currency, rates) => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const reserve = propOr('0', 'reserve', payment)
      const destinationAccountExists = propOr(false, 'destinationAccountExists', payment)
      const fee = propOr('0', 'fee', payment)
      const isDestinationChecked = Remote.Success.is(checkDestinationR)

      return {
        activeField,
        amount,
        balanceStatus: balanceR,
        currency,
        destination,
        destinationAccountExists,
        effectiveBalance,
        fee,
        from,
        isDestinationChecked,
        isDestinationExchange,
        isMnemonicVerified,
        noAccount,
        rates,
        reserve
      }
    }
    return lift(transform)(paymentR, currencyR, ratesR)
  }
)

export default getData
