import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { getFiatBalance } from 'components/Balances/wallet/selectors'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const balanceR = getFiatBalance(ownProps.fiatCurrency, state)
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)

  return lift(
    (
      balance: ExtractSuccess<typeof balanceR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>
    ) => ({
      balance,
      beneficiaries
    })
  )(balanceR, beneficiariesR)
}
