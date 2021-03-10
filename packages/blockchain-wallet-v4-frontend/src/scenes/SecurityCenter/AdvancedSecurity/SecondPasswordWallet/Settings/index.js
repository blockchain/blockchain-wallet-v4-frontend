import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'

import Settings from './template'

class SettingsContainer extends React.PureComponent {
  state = { updateToggled: false }

  onSubmit = () => {
    const { secondPasswordEnabled, secondPasswordValue } = this.props
    this.props.walletActions.toggleSecondPassword(
      secondPasswordValue,
      secondPasswordEnabled
    )
    this.props.formActions.reset('settingSecondPassword')
    this.handleToggle()
  }

  handleToggle = () => {
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  render() {
    const { ...rest } = this.props

    return (
      <Settings
        {...rest}
        onSubmit={this.onSubmit}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
        handleCancel={() => {
          this.props.formActions.reset('settingSecondPassword')
          this.handleToggle()
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  mainPassword: selectors.core.wallet.getMainPassword(state),
  secondPasswordEnabled: selectors.core.wallet.isSecondPasswordOn(state),
  secondPasswordValue: formValueSelector('settingSecondPassword')(
    state,
    'secondPassword'
  ),
  wallet: selectors.core.wallet.getWallet(state)
})

const mapDispatchToProps = dispatch => ({
  walletActions: bindActionCreators(actions.wallet, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
