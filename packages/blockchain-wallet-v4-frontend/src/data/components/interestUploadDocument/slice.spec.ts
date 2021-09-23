import { InterestEDDDocumentsResponse } from 'blockchain-wallet-v4/src/types'
import { InterestUploadDocumentsStepType } from 'data/types'

import { actions, initialState, reducer } from './slice'

const documentLimits = {
  categories: ['PROOF_OF_ADDRESS', 'PROOF_OF_INCOME', 'OTHER'],
  maxAllowedFileSizeMBs: 5,
  maxNumAllowedFiles: 8,
  validTypes: ['jpg', 'png', 'heic']
}

test('should return the initial state after starting fetch limits', () => {
  expect(reducer(undefined, actions.fetchEDDDocumentsLimits)).toEqual(initialState)
})

test('should update fetch document limits on success', () => {
  const updateSuccess = reducer(
    initialState,
    actions.fetchEDDDocumentsLimitsSuccess({ ...documentLimits })
  )

  const documentLimitsFromState = updateSuccess.interestEDDDocumentLimits.getOrElse(
    {} as InterestEDDDocumentsResponse
  )

  expect(documentLimitsFromState).toEqual(documentLimits)
})

test('should update step', () => {
  const updateSuccess = reducer(
    initialState,
    actions.setStep({ step: InterestUploadDocumentsStepType.INIT_PAGE })
  )

  const expectedState = {
    ...initialState,
    step: InterestUploadDocumentsStepType.INIT_PAGE
  }

  const documentLimitsFromState = updateSuccess.step

  expect(expectedState.step).toEqual(documentLimitsFromState)
})
