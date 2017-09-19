import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleClick () {
    const { passwordStretchingValue, password } = this.props
    this.props.walletActions.setPbkdf2Iterations(Number(passwordStretchingValue), password)
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
  password: selectors.core.wallet.getMainPassword(state),
  passwordStretchingValue: formValueSelector('settingPasswordStretching')(state, 'passwordStretching'),
  currentStretch: selectors.core.wallet.getPbkdf2Iterations(state)
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_PasswordStretching', state: { updateToggled: false } })
)

SettingContainer.propTypes = {
  passwordStretching: PropTypes.number
}

export default enhance(SettingContainer)
