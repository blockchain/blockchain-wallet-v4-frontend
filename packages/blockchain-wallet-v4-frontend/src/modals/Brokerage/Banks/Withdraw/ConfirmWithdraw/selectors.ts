import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const feesR = selectors.components.withdraw.getFeeForCurrency(
    state,
    ownProps.fiatCurrency
  )

  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(
    ownProps.fiatCurrency,
    state
  )
  let defaultMethodR = selectors.components.brokerage.getAccount(state)

  return lift(
    (
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>,
      fees: ExtractSuccess<typeof feesR>
    ) => ({
      defaultBeneficiary,
      fees,
      defaultMethod: defaultMethodR
    })
  )(defaultBeneficiaryR, feesR)
}
