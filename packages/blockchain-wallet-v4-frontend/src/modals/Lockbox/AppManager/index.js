import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  BlockchainLoader,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import * as Lockbox from 'services/LockboxService'
import App from './template'

const Wrapper = styled(ModalBody)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`
const Loader = styled(BlockchainLoader)`
  margin: 25px;
`
const LoadingText = styled(Text)`
  margin-top: 8px;
`
const ResultText = styled(Text)`
  margin-bottom: 8px;
`
const ContinueButton = styled(Button)`
  margin-top: 22px;
`

const getKeyByValue = value => {
  return Object.keys(Lockbox.constants.supportedApps).find(
    key => Lockbox.constants.supportedApps[key] === value
  )
}

class AppManagerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { appName: '', changeType: '' }
    this.onAppInstall = this.onAppInstall.bind(this)
    this.onAppUninstall = this.onAppUninstall.bind(this)
    this.onContinue = this.onContinue.bind(this)
  }

  componentDidMount () {
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
    this.props.lockboxActions.resetConnectionStatus()
  }

  onAppInstall (appName, coin) {
    this.setState({ changeType: 'Installing', appName })
    this.props.lockboxActions.installApplication(coin)
  }

  onAppUninstall (appName) {
    this.setState({ changeType: 'Uninstalling', appName })
    this.props.lockboxActions.uninstallApplication(appName)
  }

  onContinue () {
    this.setState({ changeType: '', appName: '' })
    this.props.lockboxActions.resetAppChangeStatus()
  }

  render () {
    const {
      appChangeStatus,
      appVersionInfos,
      closeAll,
      connection,
      position,
      total
    } = this.props
    const appUpdateStatus = appChangeStatus.cata({
      Success: () => (
        <Wrapper>
          <ResultText size='18px' weight={400}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.successmsg'
              defaultMessage='{changeType} {appName} was successful!'
              values={{
                changeType: this.state.changeType,
                appName: this.state.appName
              }}
            />
          </ResultText>
          <Icon
            style={{ marginTop: '10px' }}
            name='checkmark-in-circle-filled'
            color='success'
            size='60px'
          />
          <ContinueButton onClick={this.onContinue} nature='primary'>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.continue'
              defaultMessage='Continue'
            />
          </ContinueButton>
        </Wrapper>
      ),
      Failure: val => (
        <Wrapper>
          <ResultText size='18px' weight={400}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.failuremsg'
              defaultMessage='{changeType} {appName} failed!'
              values={{
                changeType: this.state.changeType,
                appName: this.state.appName
              }}
            />
          </ResultText>
          <LoadingText size='15px' weight={400}>
            {val.error()}
          </LoadingText>
          <ContinueButton onClick={this.onContinue} nature='primary'>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.continue'
              defaultMessage='Continue'
            />
          </ContinueButton>
        </Wrapper>
      ),
      Loading: () => (
        <Wrapper>
          <Loader width='75px' height='75px' />
          <LoadingText size='18px' weight={400}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.loadingmsg'
              defaultMessage='{changeType} the {appName} application'
              values={{
                changeType: this.state.changeType,
                appName: this.state.appName
              }}
            />
          </LoadingText>
          <Text size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.allowmgr'
              defaultMessage='Allow the device manager onto the device if prompted.'
            />
          </Text>
        </Wrapper>
      ),
      NotAsked: () => null
    })
    const appListView = appVersionInfos.cata({
      Success: apps => {
        const appList = apps.map((app, i) => {
          const coin = getKeyByValue(app.name)
          return (
            <App
              key={i}
              app={app}
              coin={coin}
              installApp={() => {
                this.onAppInstall(app.name, coin)
              }}
              uninstallApp={() => {
                this.onAppUninstall(app.name, coin)
              }}
            />
          )
        })
        return (
          <React.Fragment>
            {appList}
            <ContinueButton onClick={closeAll} nature='primary'>
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.close'
                defaultMessage='Close'
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
          <Loader width='75px' height='75px' />
          <LoadingText size='18px' weight={400}>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.loadingapps'
              defaultMessage='Loading application list'
            />
          </LoadingText>
        </Wrapper>
      ),
      NotAsked: () => <Loader width='75px' height='75px' />
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage
            id='modals.lockbox.appmanager.title'
            defaultMessage='App Manager'
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
            appUpdateStatus || appListView
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
  appChangeStatus: selectors.components.lockbox.getAppChangeStatus(state),
  appVersionInfos: selectors.components.lockbox.getLatestApplicationVersions(
    state
  ),
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
