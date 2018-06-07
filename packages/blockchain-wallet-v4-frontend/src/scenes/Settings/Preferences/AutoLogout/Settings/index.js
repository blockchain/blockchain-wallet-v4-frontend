
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {
    const { logoutTime } = this.props
    this.props.formActions.initialize('settingAutoLogoutTime', { autoLogoutTime: logoutTime })
    this.props.updateUI({ updateToggled: false })
  }

  handleClick () {
    const { autoLogoutTime } = this.props

    this.props.settingsActions.updateAutoLogout(parseInt(autoLogoutTime) * 60000)
    this.props.updateUI({ updateToggled: false })
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, logoutTime } = this.props

    return <Settings
      logoutTime={logoutTime}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  autoLogoutTime: parseInt(formValueSelector('settingAutoLogoutTime')(state, 'autoLogoutTime')),
  logoutTime: parseInt(selectors.core.wallet.getLogoutTime(state) / 60000)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_AutoLogoutTime', state: { updateToggled: false } })
)

export default enhance(SettingContainer)
