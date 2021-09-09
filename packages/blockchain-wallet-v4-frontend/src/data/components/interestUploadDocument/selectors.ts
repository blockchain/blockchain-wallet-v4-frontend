import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.interestUploadDocument.step
export const getInterestEDDDocumentLimits = (state: RootState) =>
  state.components.interestUploadDocument.interestEDDDocumentLimits

export default getStep
