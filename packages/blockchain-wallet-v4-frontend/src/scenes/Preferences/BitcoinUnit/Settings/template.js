import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxBitcoinUnit } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <SettingSelectBoxWrapper>
      <Field name='unit' component={SelectBoxBitcoinUnit} callback={handleClick} />
    </SettingSelectBoxWrapper>
  )
}

export default reduxForm({ form: 'settingUnit' })(Settings)
