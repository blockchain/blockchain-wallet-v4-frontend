
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
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
    // this.handleVerify = this.handleVerify.bind(this)
  }

  componentWillMount () {
    if (!isEmpty(this.props.email)) {
      this.props.reduxFormActions.initialize('settingEmailAddress', { emailAddress: this.props.email })
      this.props.updateUI({ verifyToggled: !this.props.emailVerified })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.email, nextProps.email)) {
      this.props.updateUI({ updateToggled: false, verifyToggled: true })
    }
    if (equals(this.props.email, nextProps.email) && !equals(this.props.emailVerified, nextProps.emailVerified)) {
      this.props.updateUI({ updateToggled: false, verifyToggled: false })
    }
  }

  handleClick () {
    const { guid, sharedKey, emailAddress } = this.props
    this.props.settingsActions.updateEmail(guid, sharedKey, emailAddress)
    this.handleToggle()
    this.props.updateUI({ verifyToggled: !this.props.emailVerified })
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  handleResend () {
    const { guid, sharedKey, emailAddress } = this.props
    this.props.settingsActions.updateEmail(guid, sharedKey, emailAddress)
  }

  // handleVerify () {
  //   const { guid, sharedKey, code } = this.props
  //   this.props.settingsActions.verifyEmail(guid, sharedKey, code)
  // }

  render () {
    const { ui, uiUpdate, ...rest } = this.props

    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      verifyToggled={ui.verifyToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
      handleResend={this.handleResend}
      // handleVerify={this.handleVerify}
    />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  email: selectors.core.settings.getEmail(state),
  emailVerified: selectors.core.settings.getEmailVerified(state),
  emailAddress: formValueSelector('settingEmailAddress')(state, 'emailAddress'),
  code: formValueSelector('settingEmailAddress')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_EmailAddress', state: { updateToggled: false, verifyToggled: false } }),
  singleForm('settingEmailAddress')
)

SettingContainer.propTypes = {
  email: PropTypes.string
}

export default enhance(SettingContainer)
