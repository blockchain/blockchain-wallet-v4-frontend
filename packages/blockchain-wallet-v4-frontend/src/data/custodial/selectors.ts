import { lift } from 'ramda'

import { ExtractSuccess, WalletCurrencyType } from '@core/types'
import { RootState } from 'data/rootReducer'

export const getBeneficiaries = (state: RootState) => state.custodial.beneficiaries

export const getDefaultBeneficiary = (currency: WalletCurrencyType, state: RootState) => {
  const beneficiariesR = getBeneficiaries(state)

  return lift((beneficiaries: ExtractSuccess<typeof beneficiariesR>) =>
    beneficiaries.find((val) => val.currency === currency)
  )(beneficiariesR)
}

export const getRecentSwapTxs = (state: RootState) => state.custodial.recentSwapTxs
export const getProductEligibilityForUser = (state: RootState) =>
  state.custodial.productEligibilityForUser

export const getUserHadNotifications = (state: RootState) => state.custodial.userHadNotifications

export const isKycVerificationEnabled = (state: RootState): boolean => {
  const kycVerification = state.custodial.productEligibilityForUser.getOrElse({
    kycVerification: {
      enabled: true
    }
  })

  return kycVerification.kycVerification.enabled
}
