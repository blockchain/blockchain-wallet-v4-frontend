import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import LockboxAppInstall from './template'

class LockboxAppInstallContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.installApplications(this.props.deviceId)
  }

  render () {
    return <LockboxAppInstall {...this.props} />
  }
}

LockboxAppInstallContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentStep: selectors.components.lockbox.getFirmwareUpdateStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxAppInstall'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LockboxAppInstallContainer)
