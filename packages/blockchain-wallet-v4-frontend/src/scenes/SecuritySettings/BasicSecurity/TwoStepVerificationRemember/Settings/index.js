
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { guid, sharedKey, authTypeNeverSave } = this.props
    this.props.settingsActions.updateAuthTypeNeverSave(guid, sharedKey, !authTypeNeverSave)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  authTypeNeverSave: selectors.core.settings.getAuthTypeNeverSave(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
