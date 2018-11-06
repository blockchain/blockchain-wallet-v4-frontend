import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import App from './template'

const Wrapper = styled(ModalBody)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
`

class AppManagerContainer extends React.PureComponent {
  state = { showApps: false }

  componentDidMount () {
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetConnectionStatus()
  }

  installApp () {
    this.props.lockboxActions.installApplication()
  }

  uninstallApp () {
    this.props.lockboxActions.uninstallApplication()
  }

  render () {
    const { appStatus, connection, total, position, closeAll } = this.props
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
    const xlmStatus = appStatus.XLM.cata({
      Success: () => ({ success: true }),
      Failure: resp => ({ error: resp.error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ waiting: true })
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage
            id='modals.lockbox.appmanager.title'
            defaultMessage='App Catalog'
          />
        </ModalHeader>
        <Wrapper>
          {connection.app !== 'DASHBOARD' ? (
            <Text size='16px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.connectdevice'
                defaultMessage='Plug in device, unlock and open the dashboard on your device'
              />
            </Text>
          ) : (
            <React.Fragment>
              <App
                coin='Bitcoin'
                icon='btc'
                status={btcStatus}
                onInstall={this.installApp('BTC')}
                onUninstall={this.uninstallApp('BTC')}
              />
              <App
                coin='Bitcoin Cash'
                icon='bch'
                status={bchStatus}
                onInstall={this.installApp('BCH')}
                onUninstall={this.uninstallApp('BCH')}
              />
              <App
                coin='Ethereum'
                icon='eth'
                status={ethStatus}
                onInstall={this.installApp('ETH')}
                onUninstall={this.uninstallApp('ETH')}
              />
              <App
                coin='Stellar'
                icon='xlm'
                status={xlmStatus}
                onInstall={this.installApp('XLM')}
                onUninstall={this.uninstallApp('XLM')}
              />
            </React.Fragment>
          )}
        </Wrapper>
      </Modal>
    )
  }
}

AppManagerContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  appStatus: selectors.components.lockbox.getApplicationInstalls(state),
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxAppManager'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AppManagerContainer)
