import { lift, pathOr, takeWhile } from 'ramda'
import { formValueSelector } from 'redux-form'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.walletOptions.getOptions,
    selectors.core.kvStore.buySell.getMetadata,
    selectors.core.settings.getCountryCode,
    selectors.components.coinify.getCoinifySignupStep,
    selectors.core.walletOptions.getSFOXCountries,
    selectors.core.walletOptions.getSFOXStates,
    selectors.core.walletOptions.getCoinifyCountries
  ],
  (
    optionsR,
    buySellR,
    countryCodeR,
    coinifySignupStep,
    sfoxCountriesR,
    sfoxStatesR,
    coinifyCountriesR
  ) => {
    const transform = (
      options,
      buySell,
      countryCode,
      sfoxCountries,
      sfoxStates,
      coinifyCountries
    ) => {
      return {
        options,
        buySell,
        countryCode,
        coinifySignupStep,
        sfoxCountries,
        sfoxStates,
        coinifyCountries
      }
    }
    return lift(transform)(
      optionsR,
      buySellR,
      countryCodeR,
      sfoxCountriesR,
      sfoxStatesR,
      coinifyCountriesR
    )
  }
)

export const getFields = state => {
  const country = formValueSelector('selectPartner')(state, 'country')
  return {
    type: pathOr(
      'buy',
      ['form', 'buySellTabStatus', 'values', 'status'],
      state
    ),
    country: country && takeWhile(x => x !== '-', country),
    stateSelection: formValueSelector('selectPartner')(state, 'state'),
    email: formValueSelector('selectPartner')(state, 'email')
  }
}
