import React from 'react'
import { Field, reduxForm } from 'redux-form'

import SelectBoxTheme from 'components/Form/SelectBoxTheme'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = () => (
  <SettingSelectBoxWrapper>
    <Field name='theme' component={SelectBoxTheme} />
  </SettingSelectBoxWrapper>
)

export default reduxForm({ form: 'settingTheme' })(Settings)
