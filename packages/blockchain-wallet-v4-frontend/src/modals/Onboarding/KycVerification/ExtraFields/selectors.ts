import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { KYC_EXTRA_QUESTIONS_FORM } = model.components.identityVerification

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(KYC_EXTRA_QUESTIONS_FORM)(state)
  const extraStepsR = selectors.components.identityVerification.getKYCExtraSteps(state)

  return lift((extraSteps: ExtractSuccess<typeof extraStepsR>) => ({
    extraSteps,
    formErrors
  }))(extraStepsR)
}
