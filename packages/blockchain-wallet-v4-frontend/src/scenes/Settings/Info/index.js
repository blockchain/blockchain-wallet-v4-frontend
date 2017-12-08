import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Info from './template.js'

class InfoContainer extends React.Component {
  componentWillMount () {
    this.props.settingsActions.initSettingsInfo()
  }

  render () {
    return <Info />
  }
}

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.components.settings, dispatch)
})

export default connect(undefined, mapDispatchToProps)(InfoContainer)
