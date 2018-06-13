import { formValueSelector } from 'redux-form'
import { lift, prop } from 'ramda'

import { selectors } from 'data'
import { getCountryCodeFromIban } from 'services/CoinifyService'

export const getData = (state) => {
  const insertSpaces = (str) => {
    const s = str.replace(/[^\dA-Z]/g, '')
    return s.replace(/.{4}/g, (a) => a + ' ')
  }
  const iban = insertSpaces(formValueSelector('coinifyAddBankDetails')(state, 'iban'))
  const account = {
    account: {
      currency: selectors.core.data.coinify.getFiatCurrency(state).getOrElse(null),
      bic: formValueSelector('coinifyAddBankDetails')(state, 'bic'),
      number: iban
    },
    holder: {
      name: formValueSelector('coinifyAddCustomerDetails')(state, 'fullname'),
      address: {
        street: formValueSelector('coinifyAddCustomerDetails')(state, 'street'),
        city: formValueSelector('coinifyAddCustomerDetails')(state, 'city'),
        zipcode: formValueSelector('coinifyAddCustomerDetails')(state, 'postcode'),
        country: formValueSelector('coinifyAddCustomerDetails')(state, 'country')
      }
    },
    bank: {
      address: {
        country: getCountryCodeFromIban(iban),
        street: null,
        zipcode: null,
        city: null
      }
    }
  }
  const mediumsR = selectors.core.data.coinify.getMediums(state)

  const transform = (mediums) => ({ account, medium: prop('bank', mediums) })
  return lift(transform)(mediumsR)
}
