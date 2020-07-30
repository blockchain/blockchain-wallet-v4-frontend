import { RootState } from 'data/rootReducer'

export const getBeneficiaries = (state: RootState) =>
  state.custodial.beneficiaries
