import { formValueSelector } from 'redux-form'

import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

const formSelector = formValueSelector('mobileNumberAdd')

export const getData = createDeepEqualSelector(
  [selectors.core.settings.getSmsNumber, (state) => formSelector(state, 'mobileNumber')],
  (currentNumber, smsNumberNew) => ({
    smsNumber: currentNumber.getOrElse(''),
    smsNumberNew
  })
)
