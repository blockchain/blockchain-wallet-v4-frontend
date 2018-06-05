import { lift } from 'ramda'
import { formValueSelector } from 'redux-form'

import { selectors } from 'data'

export const getData = (state) => {
  const optionsR = selectors.core.walletOptions.getOptions(state)
  const buySellR = selectors.core.kvStore.buySell.getMetadata(state)
  const countryCodeR = selectors.core.settings.getCountryCode(state)
  const transform = lift((buySell, options, countryCode) => ({ buySell, options, countryCode }))

  return {
    data: transform(buySellR, optionsR, countryCodeR),
    type: state.form.buySellTabStatus && state.form.buySellTabStatus.values.status,
    country: formValueSelector('selectPartner')(state, 'country'),
    stateSelection: formValueSelector('selectPartner')(state, 'state'),
    email: formValueSelector('selectPartner')(state, 'email')
  }
}
