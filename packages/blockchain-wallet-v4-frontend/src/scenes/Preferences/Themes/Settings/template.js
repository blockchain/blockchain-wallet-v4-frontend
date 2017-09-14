import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxTheme } from 'components/Form'
import { SettingWrapper } from 'components/Setting'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <SettingWrapper>
      <Field name='theme' component={SelectBoxTheme} callback={handleClick} />
    </SettingWrapper>
  )
}

Settings.propTypes = {
  theme: PropTypes.string.isRequired
}

export default reduxForm({ form: 'settingTheme' })(Settings)
