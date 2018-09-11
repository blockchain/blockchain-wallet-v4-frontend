import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      updateToggled: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount () {
    const { logoutTime } = this.props
    this.props.formActions.initialize('settingAutoLogoutTime', {
      autoLogoutTime: logoutTime
    })
  }

  handleClick () {
    const { autoLogoutTime } = this.props

    this.props.settingsActions.updateAutoLogout(
      parseInt(autoLogoutTime) * 60000
    )
    this.handleToggle()
  }

  handleToggle () {
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  render () {
    const { logoutTime } = this.props

    return (
      <Settings
        updateToggled={this.state.updateToggled}
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
  logoutTime: parseInt(selectors.core.wallet.getLogoutTime(state) / 60000)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingContainer)
