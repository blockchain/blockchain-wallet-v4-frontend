import React from 'react'
import { Field, reduxForm } from 'redux-form'

import SelectBoxLanguages from 'components/Form/SelectBoxLanguages'

import { SelectWrapper } from '../Currency/selection'

const Selection = () => {
  return (
    <div data-e2e='prefsWalletLanguageInput'>
      <SelectWrapper>
        <Field name='language' component={SelectBoxLanguages} />
      </SelectWrapper>
    </div>
  )
}

export default reduxForm({ form: 'settingLanguage' })(Selection)
