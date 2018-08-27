import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import OpenBtcAppStep from './template'

class OpenBtcAppStepContainer extends React.PureComponent {
  render () {
    return <OpenBtcAppStep />
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(OpenBtcAppStepContainer)
