import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import CheckVersionsStep from './template'

class CheckVersionsContainer extends React.PureComponent {
  onStartInstall = () => {
    this.props.lockboxActions.changeFirmwareUpdateStep({
      step: 'uninstall-apps'
    })
  }

  render() {
    const { status } = this.props
    return (
      <CheckVersionsStep status={status} onStartInstall={this.onStartInstall} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(null, mapDispatchToProps)(CheckVersionsContainer)
