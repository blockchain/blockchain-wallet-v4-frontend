import { lift } from 'ramda'

import { ExtractSuccess, WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

export const getBeneficiaries = (state: RootState) => state.custodial.beneficiaries

export const getDefaultBeneficiary = (currency: WalletCurrencyType, state: RootState) => {
  const beneficiariesR = getBeneficiaries(state)

  return lift((beneficiaries: ExtractSuccess<typeof beneficiariesR>) =>
    beneficiaries.find((val) => val.currency === currency)
  )(beneficiariesR)
}

export const getRecentSwapTxs = (state: RootState) => state.custodial.recentSwapTxs
