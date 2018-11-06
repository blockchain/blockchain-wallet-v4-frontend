import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  BlockchainLoader,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
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
const Loader = styled(BlockchainLoader)`
  padding: 25px;
`

const getKeyByValue = value => {
  const appNameDict = {
    BTC: 'Bitcoin',
    BCH: 'Bitcoin Cash',
    ETH: 'Ethereum',
    XLM: 'Stellar'
  }
  return Object.keys(appNameDict).find(key => appNameDict[key] === value)
}

class AppManagerContainer extends React.PureComponent {
  state = { showApps: false }

  componentDidMount () {
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppsInstallStatus()
    this.props.lockboxActions.resetConnectionStatus()
  }

  render () {
    const {
      appVersionInfosR,
      closeAll,
      connection,
      installStatusR,
      lockboxActions,
      position,
      total
    } = this.props
    const installStatus = installStatusR.cata({
      Success: val => val,
      Failure: val => val,
      Loading: val => val,
      NotAsked: val => val
    })
    const appListView = appVersionInfosR.cata({
      Success: apps => {
        console.info(apps)
        return apps.map((app, i) => {
          const coin = getKeyByValue(app.name)
          return (
            <App
              key={i}
              app={app}
              coin={coin}
              installApp={lockboxActions.installApplication.bind(null, coin)}
              uninstallApp={lockboxActions.uninstallApplication.bind(
                null,
                app.name
              )}
            />
          )
        })
      },
      Failure: () => (
        <Text size='16px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockbox.appmanager.appfailure'
            defaultMessage='Failed to load application list. Please try again later.'
          />
        </Text>
      ),
      Loading: () => <Loader width='75px' height='75px' />,
      NotAsked: () => <Loader width='75px' height='75px' />
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
            appListView
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
  appVersionInfosR: selectors.components.lockbox.getLatestApplicationVersions(
    state
  ),
  connection: selectors.components.lockbox.getCurrentConnection(state),
  installStatusR: selectors.components.lockbox.getCurrentInstallStatus(state)
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
