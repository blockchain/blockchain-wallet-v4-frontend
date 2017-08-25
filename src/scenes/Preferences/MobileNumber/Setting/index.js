
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleResend = this.handleResend.bind(this)
    this.handleVerify = this.handleVerify.bind(this)
  }

  componentWillMount () {
    this.props.reduxFormActions.initialize('settingMobilePhone', { mobileNumber: this.props.smsNumber })
  }

  handleClick () {
    console.log('handleClick')
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  handleToggle () {
    console.log('handleToggle')
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  handleResend () {
    console.log('handleResend')
    this.props.settingsActions.updateMobile(this.props.mobileNumber)
  }

  handleVerify () {
    console.log('handleVerify')
    this.props.settingsActions.verifyMobile(this.props.code)
    this.props.updateUI({ verifyToggled: !this.props.ui.verifyToggled })
  }

  render () {
    const { ui, uiUpdate, ...rest } = this.props

    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      verifyToggled={ui.verifyToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
      handleResend={this.handleResend}
      handleVerify={this.handleVerify}
    />
  }
}

const mapStateToProps = (state) => ({
  smsNumber: selectors.core.settings.getSmsNumber(state),
  mobileNumber: formValueSelector('settingMobilePhone')(state, 'mobileNumber'),
  code: formValueSelector('settingMobilePhone')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_MobileNumber', state: { updateToggled: false, verifyToggled: false } }),
  singleForm('settingMobilePhone')
)

export default enhance(SettingContainer)
