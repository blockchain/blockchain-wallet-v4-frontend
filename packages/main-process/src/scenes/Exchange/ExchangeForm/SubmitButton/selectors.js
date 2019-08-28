import { prop, take } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Remote } from 'blockchain-wallet-v4'
import { getCurrentPairAmounts } from '../selectors'
import { selectors, model } from 'data'

const { EXCHANGE_FORM } = model.components.exchange
const {
  TIERS_STATES,
  getLastAttemptedTier,
  getLastUnrejectedTier
} = model.profile

const getFormError = selectors.form.getFormError(EXCHANGE_FORM)
const isSubmitting = selectors.form.isSubmitting(EXCHANGE_FORM)
const isAsyncValidating = selectors.form.isAsyncValidating(EXCHANGE_FORM)

const { getTxError } = selectors.components.exchange

export const getData = createDeepEqualSelector(
  [
    (state, ownProps) =>
      !Remote.Success.is(getCurrentPairAmounts(state, ownProps)),
    getFormError,
    getTxError,
    isAsyncValidating,
    isSubmitting,
    state => selectors.modules.profile.getUserTiers(state).getOrElse({}),
    state => selectors.modules.profile.getTiers(state).getOrElse([])
  ],
  (disabled, error, txError, asyncValidating, submitting, userTiers, tiers) => {
    const { next, selected } = userTiers

    const lastAttemptedTier = getLastAttemptedTier(tiers) || {
      index: 0,
      state: TIERS_STATES.NONE
    }
    const lastAttemptedTierState = prop('state', lastAttemptedTier)
    const last = lastAttemptedTier.index

    const lastUnrejectedTier = getLastUnrejectedTier(take(last, tiers))
    const allAttemptedTiersRejected = !lastUnrejectedTier

    const nextTierAvailable = next > last

    const allPreviousTiersRejected = !getLastUnrejectedTier(
      take(selected - 1, tiers)
    )

    return {
      hide: allAttemptedTiersRejected && !nextTierAvailable,
      disabledPending:
        last === 0 ||
        (allPreviousTiersRejected &&
          lastAttemptedTierState === TIERS_STATES.PENDING),
      disabled,
      error,
      txError,
      asyncValidating,
      submitting
    }
  }
)
