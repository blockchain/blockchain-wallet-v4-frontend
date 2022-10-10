import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.interestUploadDocument.step
export const getEarnEDDDocumentLimits = (state: RootState) =>
  state.components.interestUploadDocument.earnEDDDocumentLimits

export default getStep
