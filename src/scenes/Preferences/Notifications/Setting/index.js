
import React from 'react'
import PropTypes from 'prop-types'
import Setting from './template.js'
import { isEmpty } from 'ramda'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'

class SettingContainer extends React.Component {
  render () {
    return <Setting />
  }
}

export default SettingContainer
