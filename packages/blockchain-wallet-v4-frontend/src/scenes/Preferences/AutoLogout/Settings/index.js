
import React from 'react'
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
    const { logoutTime } = this.props
    this.props.reduxFormActions.initialize('settingAutoLogoutTime', { autoLogoutTime: logoutTime })
    this.props.updateUI({ updateToggled: false })
  }

  handleClick () {
    const { autoLogoutTime } = this.props

    this.props.walletActions.setAutoLogout(parseInt(autoLogoutTime) * 60000)
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
  autoLogoutTime: parseInt(formValueSelector('settingAutoLogoutTime')(state, 'autoLogoutTime')),
  logoutTime: parseInt(selectors.core.wallet.getLogoutTime(state) / 60000)
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_AutoLogoutTime', state: { updateToggled: false } }),
  singleForm('settingAutoLogoutTime')
)

export default enhance(SettingContainer)
