import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxCurrency } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = () => (
  <SettingSelectBoxWrapper>
    <Field name='currency' component={SelectBoxCurrency} />
  </SettingSelectBoxWrapper>
)

export default reduxForm({ form: 'settingCurrency' })(Settings)
