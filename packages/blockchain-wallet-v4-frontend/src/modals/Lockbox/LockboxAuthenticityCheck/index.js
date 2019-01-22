import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import PropTypes from 'prop-types'

import { actions, selectors } from 'data'
import Template from './template'
import modalEnhancer from 'providers/ModalEnhancer'

class AuthenticityContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.checkDeviceAuthenticity(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetDeviceAuthenticity()
  }

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render () {
    const { currentStep, connection, position, total } = this.props
    const authenticity = this.props.authenticity.cata({
      Success: res => ({
        isAuthenticating: false,
        isAuthentic: res.isAuthentic
      }),
      Failure: () => ({ isAuthenticating: false }),
      Loading: () => ({ isAuthenticating: true }),
      NotAsked: () => ({ isAuthenticating: true })
    })

    return (
      <Template
        currentStep={currentStep}
        position={position}
        total={total}
        authenticity={authenticity}
        connection={connection}
        handleStepChange={this.changeDeviceSetupStep}
        onClose={this.onClose}
      />
    )
  }
}

AuthenticityContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  authenticity: selectors.components.lockbox.getDeviceAuthenticity(state),
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxDeviceAuthenticity'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AuthenticityContainer)
