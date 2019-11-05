import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import PasswordStretching from './template'
import PropTypes from 'prop-types'
import React from 'react'

class PasswordStretchingContainer extends React.PureComponent {
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
    return (
      <PasswordStretching
        onSubmit={this.onSubmit}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
        {...this.props}
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
  formActions: bindActionCreators(actions.form, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

PasswordStretchingContainer.propTypes = {
  passwordStretching: PropTypes.number
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordStretchingContainer)
