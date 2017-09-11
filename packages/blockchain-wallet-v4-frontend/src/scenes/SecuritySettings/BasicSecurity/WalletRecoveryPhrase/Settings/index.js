
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.modalActions.showModal('RecoveryPhrase')
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalActions: bindActionCreators(actions.modals, dispatch),
    settingsActions: bindActionCreators(actions.core.settings, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(SettingsContainer)
