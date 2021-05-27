import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import {
  BlockchainLoader,
  Button,
  Image,
  Text
} from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import * as Lockbox from 'services/lockbox'

import { FAIL_STATUS_TIMEOUT, SUCCESS_STATUS_TIMEOUT } from './model'
import LockboxAppManager from './template'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 12px;
`
const ConnectInstructions = styled(Text)`
  text-align: center;
  padding: 5px;
  margin: 30px 0 36px;
`
const AllowManagerText = styled(Text)`
  margin: 20px 0;
  text-align: center;
`
const BtcRequiredText = styled(Text)`
  margin-top: 8px;
  text-align: center;
`

const getKeyByValue = value => {
  return Object.keys(Lockbox.constants.supportedApps).find(
    key => Lockbox.constants.supportedApps[key] === value
  )
}

class LockboxAppManagerContainer extends React.PureComponent {
  state = {}

  componentDidMount() {
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentDidUpdate(prevProps) {
    if (this.props.appChangeStatus !== prevProps.appChangeStatus) {
      this.props.appChangeStatus.cata({
        Success: val => {
          // install/uninstall APIs use different keys for appName
          const AppName = Lockbox.constants.supportedApps[val.appName]
            ? Lockbox.constants.supportedApps[val.appName]
            : val.appName
          this.props.lockboxActions.resetAppChangeStatus()
          this.setState({ [AppName]: { changeType: '', status: 'Success' } })
          // clears the status text after 5 seconds
          setTimeout(() => {
            this.setState({ [AppName]: { status: null } })
          }, SUCCESS_STATUS_TIMEOUT)
        },
        Failure: val => {
          // install/uninstall APIs use different keys for appName
          const AppName = Lockbox.constants.supportedApps[val.appName]
            ? Lockbox.constants.supportedApps[val.appName]
            : val.appName
          this.props.lockboxActions.resetAppChangeStatus()
          this.setState({
            [AppName]: { status: 'Error', error: val.error }
          })
          // clears the status text after 10 seconds
          setTimeout(() => {
            this.setState({ [AppName]: { changeType: '', status: null } })
          }, FAIL_STATUS_TIMEOUT)
        },
        Loading: () => {},
        NotAsked: () => {}
      })
    }
  }

  componentWillUnmount() {
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

  render() {
    const { appChangeStatus, appVersionInfos, connection } = this.props
    const disableButtons = !Remote.NotAsked.is(appChangeStatus)
    const appListView = appVersionInfos.cata({
      Success: apps => {
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
              requireBtc={this.props.newDevice}
            />
          )
        })
        return (
          <React.Fragment>
            {appList}
            <AllowManagerText size='11px' weight={400}>
              <FormattedMessage
                id='components.lockbox.appmanager.prompt'
                defaultMessage='If prompted, be sure to allow the "Device Manager" onto the device during app updates.'
              />
            </AllowManagerText>
            {this.props.newDevice && (
              <BtcRequiredText size='10px' weight={400}>
                <FormattedMessage
                  id='components.lockbox.appmanager.btcrequired'
                  defaultMessage='The Bitcoin app is needed to connect your Lockbox to your wallet.'
                />
              </BtcRequiredText>
            )}
            <ContinueButton
              disabled={disableButtons}
              onClick={this.props.onClose}
              nature='primary'
              fullwidth
            >
              {this.props.mainButtonText}
            </ContinueButton>
          </React.Fragment>
        )
      },
      Failure: () => (
        <Text size='16px' weight={400}>
          <FormattedMessage
            id='components.lockbox.appmanager.appfailure'
            defaultMessage='Failed to load application list. Please try again later.'
          />
        </Text>
      ),
      Loading: () => (
        <Wrapper>
          <Loader style={{ margin: '32px' }} width='75px' height='75px' />
        </Wrapper>
      ),
      NotAsked: () => (
        <Wrapper>
          <Loader style={{ margin: '32px' }} width='75px' height='75px' />
        </Wrapper>
      )
    })

    return (
      <Wrapper>
        {connection.app !== 'DASHBOARD' ? (
          <ConnectStep>
            <Image width='100%' name='lockbox-onboard-connect' />
            <ConnectInstructions size='14px' weight={400}>
              <FormattedMessage
                id='components.lockbox.appmanager.connectdevice'
                defaultMessage='Connect, unlock and open the Dashboard on your Lockbox device now.'
              />
            </ConnectInstructions>
            <ContinueButton disabled nature='primary' fullwidth>
              <FormattedMessage
                id='components.lockbox.appmanager.waiting'
                defaultMessage='Waiting...'
              />
            </ContinueButton>
          </ConnectStep>
        ) : (
          appListView
        )}
      </Wrapper>
    )
  }
}

LockboxAppManagerContainer.propTypes = {
  deviceIndex: PropTypes.string,
  mainButtonText: PropTypes.element.isRequired,
  newDevice: PropTypes.bool,
  onClose: PropTypes.func.isRequired
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
