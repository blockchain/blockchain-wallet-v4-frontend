import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals, isEmpty } from 'ramda'

import { actions, selectors } from 'data'
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

  componentWillMount () {
    if (!isEmpty(this.props.currentWhitelist)) {
      this.props.formActions.initialize('settingIPWhitelist', {
        IPWhitelist: this.props.currentWhitelist
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.currentWhitelist, nextProps.currentWhitelist)) {
      this.handleToggle()
    }
  }

  onSubmit () {
    this.props.settingsActions.updateIpLock(this.props.IPWhitelist)
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
          this.props.formActions.reset('settingIPWhitelist')
          this.handleToggle()
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentWhitelist: selectors.core.settings.getIpLock(state).getOrElse(''),
  IPWhitelist: formValueSelector('settingIPWhitelist')(state, 'IPWhitelist')
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

SettingsContainer.propTypes = {
  currentWhitelist: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
