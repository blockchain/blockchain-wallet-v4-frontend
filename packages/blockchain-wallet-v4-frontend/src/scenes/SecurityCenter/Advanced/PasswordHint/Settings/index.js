import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      updateToggled: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  onSubmit () {
    this.props.settingsActions.updateHint(this.props.passwordHintValue)
    this.handleToggle()
  }

  handleToggle () {
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
        handleCancel={() => {
          this.props.formActions.reset('settingPasswordHint')
          this.handleToggle()
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  passwordHintValue: formValueSelector('settingPasswordHint')(
    state,
    'passwordHint'
  )
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.core.settings, dispatch)
})

SettingsContainer.propTypes = {
  passwordHint: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
