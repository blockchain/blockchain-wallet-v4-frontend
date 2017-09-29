
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleClick () {
    const { guid, sharedKey, passwordHintValue } = this.props
    this.props.settingsActions.updateHint(guid, sharedKey, passwordHintValue)
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
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  passwordHintValue: formValueSelector('settingPasswordHint')(state, 'passwordHint'),
  currentHint: selectors.core.settings.getHint(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_PasswordHint', state: { updateToggled: false } })
)

SettingsContainer.propTypes = {
  passwordHint: PropTypes.string
}

export default enhance(SettingsContainer)
