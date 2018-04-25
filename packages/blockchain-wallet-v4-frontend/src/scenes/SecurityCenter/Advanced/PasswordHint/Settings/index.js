
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleClick () {
    this.props.settingsActions.updateHint(this.props.passwordHintValue)
    this.handleToggle()
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, ...rest } = this.props

    return <Settings {...rest}
      updateToggled={ui.updateToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
      handleCancel={() => { this.props.formActions.reset('settingPasswordHint'); this.handleToggle() }}
    />
  }
}

const mapStateToProps = (state) => ({
  passwordHintValue: formValueSelector('settingPasswordHint')(state, 'passwordHint')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_PasswordHint', state: { updateToggled: false } })
)

SettingsContainer.propTypes = {
  passwordHint: PropTypes.string
}

export default enhance(SettingsContainer)
