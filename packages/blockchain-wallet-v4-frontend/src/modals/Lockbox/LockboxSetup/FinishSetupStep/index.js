import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import PropTypes from 'prop-types'

import { requireUniqueDeviceName } from 'services/FormHelper'
import FinishSetupStep from './template'

class FinishSetupStepContainer extends React.PureComponent {
  onFinishSetup = showTour => {
    this.props.lockboxActions.saveNewDeviceKvStore()
    this.props.onClose()
    if (showTour) {
      // TODO: start tour
    }
  }

  render () {
    return (
      <FinishSetupStep
        deviceType={this.props.deviceType}
        onFinishSetup={this.onFinishSetup}
      />
    )
  }
}

FinishSetupStepContainer.propTypes = {
  onClose: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  deviceType: selectors.components.lockbox.getNewDeviceType(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinishSetupStepContainer)
