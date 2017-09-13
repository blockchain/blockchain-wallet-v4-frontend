
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import { equals, isEmpty } from 'ramda'

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
    if (!isEmpty(this.props.smsNumber)) {
      this.props.reduxFormActions.initialize('settingMobilePhone', { mobileNumber: this.props.smsNumber })
      this.props.updateUI({ verifyToggled: !this.props.smsVerified })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.smsNumber, nextProps.smsNumber)) {
      this.props.updateUI({ updateToggled: false, verifyToggled: true })
    }
    if (equals(this.props.smsNumber, nextProps.smsNumber) && !equals(this.props.smsVerified, nextProps.smsVerified)) {
      this.props.updateUI({ updateToggled: false, verifyToggled: false })
    }
  }

  handleClick () {
    const { guid, sharedKey, mobileNumber } = this.props
    this.props.settingsActions.updateMobile(guid, sharedKey, mobileNumber)
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  handleResend () {
    const { guid, sharedKey, mobileNumber } = this.props
    this.props.settingsActions.updateMobile(guid, sharedKey, mobileNumber)
  }

  handleVerify () {
    const { guid, sharedKey, code } = this.props
    this.props.settingsActions.verifyMobile(guid, sharedKey, code)
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
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  smsNumber: selectors.core.settings.getSmsNumber(state),
  smsVerified: selectors.core.settings.getSmsVerified(state),
  mobileNumber: formValueSelector('settingMobilePhone')(state, 'mobileNumber'),
  code: formValueSelector('settingMobilePhone')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_MobileNumber', state: { updateToggled: false, verifyToggled: false } })
)

SettingContainer.propTypes = {
  smsNumber: PropTypes.string
}

export default enhance(SettingContainer)
