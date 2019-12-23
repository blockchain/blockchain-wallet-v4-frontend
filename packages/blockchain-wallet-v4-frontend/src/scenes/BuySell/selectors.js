import { createDeepEqualSelector } from 'services/ReselectHelper'
import { formValueSelector } from 'redux-form'
import { lift, pathOr, take, takeWhile } from 'ramda'
import { model, selectors } from 'data'

const {
  TIERS_STATES,
  getLastAttemptedTier,
  getLastUnrejectedTier
} = model.profile

export const getData = createDeepEqualSelector(
  [
    selectors.core.walletOptions.getOptions,
    selectors.core.kvStore.buySell.getMetadata,
    selectors.core.settings.getCountryCode,
    selectors.components.coinify.getCoinifySignupStep,
    selectors.core.walletOptions.getSFOXCountries,
    selectors.core.walletOptions.getSFOXStates,
    selectors.core.walletOptions.getCoinifyCountries,
    state => selectors.modules.profile.getUserTiers(state).getOrElse({}),
    state => selectors.modules.profile.getTiers(state).getOrElse([])
  ],
  (
    optionsR,
    buySellR,
    countryCodeR,
    coinifySignupStep,
    sfoxCountriesR,
    sfoxStatesR,
    coinifyCountriesR,
    userTiers,
    tiers
  ) => {
    const transform = (
      options,
      buySell,
      countryCode,
      sfoxCountries,
      sfoxStates,
      coinifyCountries
    ) => {
      const { next } = userTiers || { next: 1 }
      const lastAttemptedTier = getLastAttemptedTier(tiers) || {
        index: 0,
        state: TIERS_STATES.NONE
      }
      const last = lastAttemptedTier.index
      const allAttemptedTiersRejected = !getLastUnrejectedTier(
        take(last, tiers)
      )
      const nextTierAvailable = next > last
      return {
        options,
        buySell,
        countryCode,
        coinifySignupStep,
        sfoxCountries,
        sfoxStates,
        coinifyCountries,
        showRejectedNotification:
          allAttemptedTiersRejected && !nextTierAvailable
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
