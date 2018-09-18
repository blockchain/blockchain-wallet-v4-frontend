import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import LockboxAppInstall from './template'
import CoinInstallStatus from './status.template'

class LockboxAppInstallContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onContinue = this.onContinue.bind(this)
    this.state = { isInstallStep: false }
  }

  componentDidMount () {
    this.props.lockboxActions.installBlockchainApps(this.props.deviceIndex)
  }

  onContinue () {
    this.setState({ isInstallStep: true })
  }

  render () {
    const { appStatus, blockchainStatus, connection } = this.props
    const isOnDashboard = connection.app === 'DASHBOARD'
    const btcStatus = appStatus.BTC.cata({
      Success: () => ({ success: true }),
      Failure: resp => ({ error: resp.error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ waiting: true })
    })
    const bchStatus = appStatus.BCH.cata({
      Success: () => ({ success: true }),
      Failure: resp => ({ error: resp.error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ waiting: true })
    })
    const ethStatus = appStatus.ETH.cata({
      Success: () => ({ success: true }),
      Failure: resp => ({ error: resp.error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ waiting: true })
    })
    const overallStatus = blockchainStatus.cata({
      Success: () => ({ busy: false }),
      Failure: resp => ({ error: resp.error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ busy: true })
    })

    return (
      <LockboxAppInstall
        overallStatus={overallStatus}
        isOnDashboard={isOnDashboard}
        isInstallStep={this.state.isInstallStep}
        onContinue={this.onContinue}
        {...this.props}
      >
        <CoinInstallStatus coin='Bitcoin' status={btcStatus} />
        <CoinInstallStatus coin='Bitcoin Cash' status={bchStatus} />
        <CoinInstallStatus coin='Ethereum' status={ethStatus} />
      </LockboxAppInstall>
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
