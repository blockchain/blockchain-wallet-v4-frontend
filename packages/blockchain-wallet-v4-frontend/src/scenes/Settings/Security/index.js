import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'

import { actions } from 'data'
import SecuritySettings from './template.js'

class SecurityContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {
    this.props.settingsActions.initSettingsSecurity()
  }

  handleToggle () {
    this.props.updateUI({ toggled: !this.props.ui.toggled })
  }

  render () {
    return <SecuritySettings toggled={this.props.ui.toggled} handleToggle={this.handleToggle} />
  }
}

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.components.settings, dispatch)
})

const enhance = compose(
  connect(undefined, mapDispatchToProps),
  ui({ state: { toggled: false } })
)

export default enhance(SecurityContainer)
