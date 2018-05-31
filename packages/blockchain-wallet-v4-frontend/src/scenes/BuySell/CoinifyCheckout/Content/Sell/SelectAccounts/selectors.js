import { lift } from 'ramda'
import { formValueSelector } from 'redux-form'

import { selectors } from 'data'

export const getData = (state) => {
  const bankAccounts = selectors.core.data.coinify.getBankAccounts(state)
  return {
    data: lift(b => ({ bankAccounts: b }))(bankAccounts),
    radioButtonSelected: formValueSelector('radioButtonSelected')(state, 'iban')
  }
}
