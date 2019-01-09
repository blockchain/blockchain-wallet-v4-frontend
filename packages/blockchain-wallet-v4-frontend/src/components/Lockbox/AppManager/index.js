import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'

import {
  BlockchainLoader,
  Button,
  Image,
  ModalBody,
  Text
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import * as Lockbox from 'services/LockboxService'
import LockboxAppManager from './template'
import { Remote } from 'blockchain-wallet-v4'

const Wrapper = styled(ModalBody)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px;
`
const ConnectStep = styled.div`
  text-align: center;
  & > :last-child {
    margin: 10px 0;
  }
`
const Loader = styled(BlockchainLoader)`
  margin: 20px;
`
const ContinueButton = styled(Button)`
  margin-top: 22px;
`
const Subtitle = styled(Text)`
  text-align: center;
  padding: 5px;
  margin-bottom: 10px;
`

const getKeyByValue = value => {
  return Object.keys(Lockbox.constants.supportedApps).find(
    key => Lockbox.constants.supportedApps[key] === value
  )
}

class LockboxAppManagerContainer extends React.PureComponent {
  state = {}

  componentDidMount () {
    // TODO: if not setup mode
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
  }

  onAppInstall = (appName, coin) => {
    this.setState({
      [appName]: {
        status: 'Updating',
        changeType: 'Installing',
        appName
      }
    })
    this.props.lockboxActions.installApplication(coin)
  }

  onAppUninstall = appName => {
    this.setState({
      [appName]: {
        status: 'Updating',
        changeType: 'Uninstalling',
        appName
      }
    })
    this.props.lockboxActions.uninstallApplication(appName)
  }

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render () {
    const { appChangeStatus, appVersionInfos, connection } = this.props

    appChangeStatus.cata({
      Success: val => {
        // install/uninstall APIs use different keys for appName
        const AppName = Lockbox.constants.supportedApps[val.appName]
          ? Lockbox.constants.supportedApps[val.appName]
          : val.appName
        this.props.lockboxActions.resetAppChangeStatus()
        this.setState({
          [AppName]: {
            changeType: '',
            status: 'Success'
          }
        })
        setTimeout(() => {
          this.setState({
            [AppName]: { status: null }
          })
        }, 4000)
      },
      Failure: val => {
        // install/uninstall APIs use different keys for appName
        const AppName = Lockbox.constants.supportedApps[val.appName]
          ? Lockbox.constants.supportedApps[val.appName]
          : val.appName
        this.props.lockboxActions.resetAppChangeStatus()
        this.setState({
          [AppName]: { status: 'Error' }
        })
        setTimeout(() => {
          this.setState({
            [AppName]: { changeType: '', status: null }
          })
        }, 10000)
      },
      Loading: () => {},
      NotAsked: () => {}
    })
    const appListView = appVersionInfos.cata({
      Success: apps => {
        const disableButtons = !Remote.NotAsked.is(appChangeStatus)
        const appList = apps.map(app => {
          const appName = app.name
          const coin = getKeyByValue(appName)
          return (
            <LockboxAppManager
              key={appName}
              app={app}
              coin={coin}
              installApp={() => {
                this.onAppInstall(appName, coin)
              }}
              uninstallApp={() => {
                this.onAppUninstall(appName)
              }}
              coinState={this.state[appName]}
              disableUpdates={disableButtons}
            />
          )
        })
        return (
          <React.Fragment>
            {appList}
            <ContinueButton
              disabled={disableButtons}
              onClick={this.onClose}
              nature='primary'
              fullwidth
            >
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.close'
                defaultMessage='Close App Manager'
              />
            </ContinueButton>
          </React.Fragment>
        )
      },
      Failure: () => (
        <Text size='16px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockbox.appmanager.appfailure'
            defaultMessage='Failed to load application list. Please try again later.'
          />
        </Text>
      ),
      Loading: () => (
        <Wrapper>
          <Loader width='100px' height='100px' />
        </Wrapper>
      ),
      NotAsked: () => <Loader width='75px' height='75px' />
    })

    return (
      <Wrapper>
        {connection.app !== 'DASHBOARD' ? (
          <ConnectStep>
            <Subtitle size='16px' weight={400} color='gray-4'>
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.connectdevice'
                defaultMessage='Connect, unlock and open the Dashboard on your Lockbox device now.'
              />
            </Subtitle>
            <Image width='100%' name='lockbox-onboard-connect' />
          </ConnectStep>
        ) : (
          appListView
        )}
      </Wrapper>
    )
  }
}

LockboxAppManagerContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  appChangeStatus: selectors.components.lockbox.getAppChangeStatus(state),
  appVersionInfos: selectors.components.lockbox.getLatestApplicationVersions(
    state
  ),
  connection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxAppManagerContainer)
