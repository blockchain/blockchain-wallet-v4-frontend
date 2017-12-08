import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxBitcoinUnit } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = (props) => (
  <SettingSelectBoxWrapper>
    <Field name='unit' component={SelectBoxBitcoinUnit} />
  </SettingSelectBoxWrapper>
)

export default reduxForm({ form: 'settingUnit' })(Settings)
