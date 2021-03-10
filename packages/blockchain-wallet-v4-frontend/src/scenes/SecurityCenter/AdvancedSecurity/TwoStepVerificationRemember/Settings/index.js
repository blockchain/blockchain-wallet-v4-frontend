import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import Settings from './template'

class SettingsContainer extends React.PureComponent {
  handleClick = () => {
    this.props.settingsActions.updateTwoStepRemember(
      Number(!this.props.authTypeNeverSave)
    )
  }

  render() {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = state => ({
  authTypeNeverSave: selectors.core.settings
    .getAuthTypeNeverSave(state)
    .getOrElse(0)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
