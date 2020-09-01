import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { getWithdrawableFiatBalance } from 'components/Balances/wallet/selectors'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const balanceR = getWithdrawableFiatBalance(ownProps.fiatCurrency, state)
  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(state)
  const formErrors = selectors.form.getFormSyncErrors('custodyWithdrawForm')(
    state
  )
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      balance: ExtractSuccess<typeof balanceR>,
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      balance,
      defaultBeneficiary,
      formErrors,
      userData
    })
  )(balanceR, defaultBeneficiaryR, userDataR)
}
