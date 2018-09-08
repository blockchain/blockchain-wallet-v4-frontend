import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  getDerivedStateFromProps () {
    const { logoutTime } = this.props
    this.props.formActions.initialize('settingAutoLogoutTime', {
      autoLogoutTime: logoutTime
    })
    this.props.uiActions.toggleAutoLogout()
  }

  handleClick () {
    const { autoLogoutTime } = this.props

    this.props.settingsActions.updateAutoLogout(
      parseInt(autoLogoutTime) * 60000
    )
    this.props.uiActions.toggleAutoLogout()
  }

  handleToggle () {
    this.props.uiActions.toggleAutoLogout()
  }

  render () {
    const { logoutTime, updateToggled } = this.props

    return (
      <Settings
        updateToggled={updateToggled}
        logoutTime={logoutTime}
        handleToggle={this.handleToggle}
        handleClick={this.handleClick}
      />
    )
  }
}

const mapStateToProps = state => ({
  autoLogoutTime: parseInt(
    formValueSelector('settingAutoLogoutTime')(state, 'autoLogoutTime')
  ),

  logoutTime: parseInt(selectors.core.wallet.getLogoutTime(state) / 60000),
  updateToggled: state.preferences.updateToggled
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  uiActions: bindActionCreators(actions.preferences, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SettingContainer)
