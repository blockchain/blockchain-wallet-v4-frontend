
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleClick () {
    this.props.walletActions.setMainPassword(this.props.newWalletPasswordValue)
    this.props.formActions.reset('settingWalletPassword')
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
      handleCancel={() => { this.props.formActions.reset('settingWalletPassword'); this.handleToggle() }}
    />
  }
}

const mapStateToProps = (state) => ({
  currentWalletPassword: selectors.core.wallet.getMainPassword(state),
  walletPasswordValue: formValueSelector('settingWalletPassword')(state, 'currentPassword'),
  newWalletPasswordValue: formValueSelector('settingWalletPassword')(state, 'newPassword')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.wallet, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_WalletPassword', state: { updateToggled: false } })
)

export default enhance(SettingsContainer)
