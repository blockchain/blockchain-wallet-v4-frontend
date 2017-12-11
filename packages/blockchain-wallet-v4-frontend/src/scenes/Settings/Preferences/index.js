import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Info from './template.js'

class PreferencesContainer extends React.Component {
  componentWillMount () {
    this.props.settingsActions.initSettingsPreferences()
  }

  render () {
    return <Info />
  }
}

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(undefined, mapDispatchToProps)(PreferencesContainer)
