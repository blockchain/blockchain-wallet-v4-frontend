import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxLanguages } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = () => (
  <SettingSelectBoxWrapper data-e2e='prefsWalletLanguageInput'>
    <Field name='language' component={SelectBoxLanguages} />
  </SettingSelectBoxWrapper>
)

export default reduxForm({ form: 'settingLanguage' })(Settings)
