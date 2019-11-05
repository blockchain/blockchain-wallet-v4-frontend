import { anyPass, equals } from 'ramda'
import { model, selectors } from 'data'

const { KYC_STATES } = model.profile
const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS

export const getData = state => {
  const kycNotFinished = selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(KYC_STATES.NONE))
    .getOrElse(false)
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const isPitAccountLinked = selectors.modules.profile
    .isPitAccountLinked(state)
    .getOrElse(true)
  const isInvitedToPitHomeBanner = selectors.modules.profile
    .isInvitedToPitHomeBanner(state)
    .getOrElse(false)

  let bannerToShow
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (isInvitedToPitHomeBanner && !isPitAccountLinked) {
    bannerToShow = 'thepit'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow,
    kycNotFinished
  }
}
