import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType, UserDataType } from 'data/types'

import { OwnProps } from '.'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const feesR = selectors.components.withdraw.getFeeForCurrency(state, ownProps.fiatCurrency)

  const defaultBeneficiaryR = selectors.custodial.getDefaultBeneficiary(
    ownProps.fiatCurrency,
    state
  )
  const defaultMethodR = selectors.components.brokerage.getAccount(state) as BankTransferAccountType
  const userDataR = selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)

  return lift(
    (
      defaultBeneficiary: ExtractSuccess<typeof defaultBeneficiaryR>,
      fees: ExtractSuccess<typeof feesR>
    ) => ({
      defaultBeneficiary,
      defaultMethod: defaultMethodR,
      fees,
      userData: userDataR
    })
  )(defaultBeneficiaryR, feesR)
}
