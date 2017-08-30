
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
  }

  componentWillMount () {
    this.props.reduxFormActions.initialize('settingAutoLogoutTime', { logoutTime: this.props.autoLogoutTime })
    this.props.updateUI({ updateToggled: false })
  }

  handleClick () {
    const { guid, sharedKey, logoutTime } = this.props
    this.props.settingsActions.updateAutoLogout(guid, sharedKey, logoutTime)
    this.props.updateUI({ updateToggled: false })
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, uiUpdate, ...rest } = this.props

    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  autoLogoutTime: selectors.core.settings.getAutoLogout(state),
  logoutTime: formValueSelector('settingAutoLogoutTime')(state, 'logoutTime')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_AutoLogoutTime', state: { updateToggled: false } }),
  singleForm('settingAutoLogoutTime')
)

SettingContainer.propTypes = {
  autoLogoutTime: PropTypes.string
}

export default enhance(SettingContainer)
