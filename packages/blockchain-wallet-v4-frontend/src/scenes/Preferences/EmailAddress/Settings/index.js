
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
    this.props.settingsActions.updateEmail(this.props.emailAddress)
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  handleResend () {
    this.props.settingsActions.updateEmail(this.props.emailAddress)
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
    />
  }
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state),
  emailVerified: selectors.core.settings.getEmailVerified(state),
  emailAddress: formValueSelector('settingEmailAddress')(state, 'emailAddress'),
  code: formValueSelector('settingEmailAddress')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_EmailAddress', state: { updateToggled: false, verifyToggled: false } })
)

SettingContainer.propTypes = {
  email: PropTypes.string
}

export default enhance(SettingContainer)
