import { formValueSelector } from 'redux-form'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'

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
