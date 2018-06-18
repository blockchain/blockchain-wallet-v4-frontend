import { lift, path, takeWhile } from 'ramda'
import { formValueSelector } from 'redux-form'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.walletOptions.getOptions,
    selectors.core.kvStore.buySell.getMetadata,
    selectors.core.settings.getCountryCode
  ],
  (optionsR, buySellR, countryCodeR) => {
    const transform = (options, buySell, countryCode) => {
      return {
        options,
        buySell,
        countryCode
      }
    }
    return lift(transform)(optionsR, buySellR, countryCodeR)
  }
)

export const getFields = (state) => {
  const country = formValueSelector('selectPartner')(state, 'country')
  return {
    type: path(['form', 'buySellTabStatus', 'values', 'status'], state) || 'buy',
    country: country && takeWhile(x => x !== '-', country),
    stateSelection: formValueSelector('selectPartner')(state, 'state'),
    email: formValueSelector('selectPartner')(state, 'email')
  }
}
