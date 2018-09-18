import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import LockboxAppInstall from './template'

class LockboxAppInstallContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.installBlockchainApps(this.props.deviceIndex)
  }

  render () {
    let { appStatus, blockchainStatus, connection } = this.props
    let isOnDashboard = connection.app === 'DASHBOARD'
    let btcBusy = appStatus.BTC.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => true
    })
    let bchBusy = appStatus.BCH.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => true
    })
    let ethBusy = appStatus.ETH.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => true
    })
    let overallBusy = blockchainStatus.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => true
    })

    return (
      <LockboxAppInstall
        btcBusy={btcBusy}
        ethBusy={ethBusy}
        bchBusy={bchBusy}
        overallBusy={overallBusy}
        isOnDashboard={isOnDashboard}
        {...this.props}
      />
    )
  }
}

LockboxAppInstallContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  appStatus: selectors.components.lockbox.getApplicationInstalls(state),
  blockchainStatus: selectors.components.lockbox.getBlockchainInstall(state),
  connection: selectors.components.lockbox.getCurrentConnection(state)
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
