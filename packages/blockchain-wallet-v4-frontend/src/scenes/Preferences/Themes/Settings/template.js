import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxTheme } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <SettingSelectBoxWrapper>
      <Field name='theme' component={SelectBoxTheme} callback={handleClick} />
    </SettingSelectBoxWrapper>
  )
}

Settings.propTypes = {
  theme: PropTypes.string.isRequired
}

export default reduxForm({ form: 'settingTheme' })(Settings)
