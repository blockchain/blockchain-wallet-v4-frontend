import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCancel = this.handleToggle.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.updateDeviceName(
      this.props.deviceId,
      this.props.deviceName
    )
    this.handleToggle()
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  handleCancel () {
    this.props.formActions.reset('RenameDevice')
    this.handleToggle()
  }

  render () {
    const { ui, ...rest } = this.props
    return (
      <Settings
        {...rest}
        onSubmit={this.onSubmit}
        updateToggled={ui.updateToggled}
        handleToggle={this.handleToggle}
        handleCancel={this.handleCancel}
      />
    )
  }
}

const mapStateToProps = state => ({
  deviceName: formValueSelector('RenameDevice')(state, 'DeviceName')
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.core.kvStore.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ui({
    key: 'Settings_RenameDevice',
    state: { updateToggled: false }
  })
)

export default enhance(SettingsContainer)
