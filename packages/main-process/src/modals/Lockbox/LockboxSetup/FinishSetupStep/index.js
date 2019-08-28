import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model } from 'data'
import PropTypes from 'prop-types'

import FinishSetupStep from './template'

const { COMPLETE, VIEW_TOUR } = model.analytics.LOCKBOX_EVENTS.DEVICE_SETUP

class FinishSetupStepContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.saveNewDeviceKvStore()
  }

  onFinishSetup = showTour => {
    this.props.lockboxActions.routeNewDeviceToDashboard(showTour)
    this.props.onClose()
    this.props.analyticsActions.logEvent([...VIEW_TOUR, showTour])
    this.props.analyticsActions.logEvent(COMPLETE)
  }

  render () {
    return <FinishSetupStep onFinishSetup={this.onFinishSetup} />
  }
}

FinishSetupStepContainer.propTypes = {
  onClose: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(FinishSetupStepContainer)
