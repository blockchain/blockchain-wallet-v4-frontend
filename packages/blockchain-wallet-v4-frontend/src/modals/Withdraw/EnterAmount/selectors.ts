import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { getFiatBalance } from 'components/Balances/wallet/selectors'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const balanceR = getFiatBalance(ownProps.fiatCurrency, state)
  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(state)
  const formErrors = selectors.form.getFormSyncErrors('custodyWithdrawForm')(
    state
  )

  return lift(
    (
      balance: ExtractSuccess<typeof balanceR>,
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>
    ) => ({
      balance,
      defaultBeneficiary,
      formErrors
    })
  )(balanceR, defaultBeneficiaryR)
}
