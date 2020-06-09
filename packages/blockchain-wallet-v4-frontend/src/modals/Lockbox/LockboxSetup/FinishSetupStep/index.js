import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import FinishSetupStep from './template'

class FinishSetupStepContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.saveNewDeviceKvStore()
  }

  onFinishSetup = showTour => {
    this.props.lockboxActions.routeNewDeviceToDashboard(showTour)
    this.props.onClose()
  }

  render () {
    return <FinishSetupStep onFinishSetup={this.onFinishSetup} />
  }
}

FinishSetupStepContainer.propTypes = {
  onClose: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(null, mapDispatchToProps)(FinishSetupStepContainer)
