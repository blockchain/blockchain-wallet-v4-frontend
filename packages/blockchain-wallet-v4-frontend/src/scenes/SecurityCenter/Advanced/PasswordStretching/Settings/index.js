import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  state = { updateToggled: false }

  onSubmit = () => {
    const { passwordStretchingValue } = this.props
    this.props.walletActions.updatePbkdf2Iterations(
      Number(passwordStretchingValue)
    )
    this.handleToggle()
  }

  handleToggle = () => {
    this.props.formActions.reset('settingPasswordStretching')
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  render () {
    const { ...rest } = this.props

    return (
      <Settings
        {...rest}
        onSubmit={this.onSubmit}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
      />
    )
  }
}

const mapStateToProps = state => ({
  passwordStretchingValue: formValueSelector('settingPasswordStretching')(
    state,
    'passwordStretching'
  ),
  currentStretch: selectors.core.wallet.getPbkdf2Iterations(state)
})

const mapDispatchToProps = dispatch => ({
  walletActions: bindActionCreators(actions.wallet, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

SettingsContainer.propTypes = {
  passwordStretching: PropTypes.number
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
