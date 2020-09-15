import { formValueSelector } from 'redux-form'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

const formSelector = formValueSelector('mobileNumberChange')

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getSmsNumber,
    state => formSelector(state, 'mobileNumber')
  ],
  (currentNumber, smsNumberNew) => ({
    smsNumberNew,
    smsNumber: currentNumber.getOrElse('')
  })
)
