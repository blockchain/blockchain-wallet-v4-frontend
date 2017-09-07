
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import ui from 'redux-ui'

import { actions } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleClick () {
    // const { walletPasswordValue, newPasswordValue } = this.props
    // this.props.walletActions.changeWalletPassword(walletPasswordValue, newPasswordValue)
    this.handleToggle()
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, ...rest } = this.props

    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  walletPasswordValue: formValueSelector('settingWalletPassword')(state, 'currentPassword'),
  newWalletPasswordValue: formValueSelector('settingWalletPassword')(state, 'newPassword')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_WalletPassword', state: { updateToggled: false } }),
  singleForm('settingWalletPassword')
)

export default enhance(SettingContainer)
