import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxCurrency } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <SettingSelectBoxWrapper>
      <Field name='currency' component={SelectBoxCurrency} callback={handleClick} />
    </SettingSelectBoxWrapper>
  )
}

export default reduxForm({ form: 'settingCurrency' })(Settings)
