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
  Image,
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
  padding: 18px;
`
const ConnectStep = styled.div`
  text-align: center;
  & > :last-child {
    margin: 10px 0;
  }
`
const Loader = styled(BlockchainLoader)`
  margin: 25px;
`
const ContinueButton = styled(Button)`
  margin-top: 22px;
`
const Subtitle = styled(Text)`
  text-align: center;
  padding: 5px;
  margin-bottom: 10px;
`
const FailureText = styled(Text)`
  padding: 14px;
`
const LoadingText = styled(Text)`
  margin-bottom: 20px;
  text-align: center;
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
      closeModal,
      connection,
      position,
      total
    } = this.props
    const appUpdateStatus = appChangeStatus.cata({
      Success: () => (
        <Wrapper>
          <LoadingText size='16px'>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.success'
              defaultMessage='{changeType} the {appName} was successful!'
              values={{
                appName: this.state.appName.toLowerCase(),
                changeType: this.state.changeType
              }}
            />
          </LoadingText>
          <Icon
            style={{ marginTop: '10px' }}
            name='checkmark-in-circle'
            color='success'
            size='60px'
          />
          <ContinueButton onClick={this.onContinue} nature='primary' fullwidth>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.continue'
              defaultMessage='Continue'
            />
          </ContinueButton>
        </Wrapper>
      ),
      Failure: val => (
        <Wrapper>
          <LoadingText size='16px'>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.failure'
              defaultMessage='{changeType} the {appName} application has failed for the following reason:'
              values={{
                appName: this.state.appName.toLowerCase(),
                changeType: this.state.changeType
              }}
            />
          </LoadingText>
          <FailureText size='14px' weight='400' color='gray-4'>
            {val.error()}
          </FailureText>
          <ContinueButton onClick={this.onContinue} nature='primary' fullwidth>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.continue'
              defaultMessage='Continue'
            />
          </ContinueButton>
        </Wrapper>
      ),
      Loading: () => (
        <Wrapper>
          <LoadingText size='16px'>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.installing'
              defaultMessage='{changeType} the {appName} application {direction} your device. Allow the device manager onto the device if prompted.'
              values={{
                appName: this.state.appName.toLowerCase(),
                changeType: this.state.changeType,
                direction:
                  this.state.changeType === 'Installing' ? 'onto' : 'from'
              }}
            />
          </LoadingText>
          <Loader width='75px' height='75px' />
        </Wrapper>
      ),
      NotAsked: () => null
    })
    const appListView = appVersionInfos.cata({
      Success: apps => {
        const appList = apps.map(app => {
          const name = app.name
          const coin = getKeyByValue(name)
          return (
            <App
              key={name}
              app={app}
              coin={coin}
              installApp={() => {
                this.onAppInstall(name, coin)
              }}
              uninstallApp={() => {
                this.onAppUninstall(name, coin)
              }}
            />
          )
        })
        return (
          <React.Fragment>
            <Subtitle size='16px' weight='400'>
              <FormattedHTMLMessage
                id='modals.lockbox.appmanager.subtitle'
                defaultMessage='Install, update and uninstall desired apps from your Lockbox device.'
              />
            </Subtitle>
            {appList}
            <ContinueButton onClick={closeModal} nature='primary' fullwidth>
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
          <LoadingText size='18px' weight='400'>
            <FormattedHTMLMessage
              id='modals.lockbox.appmanager.loadingapps'
              defaultMessage='Loading Application List'
            />
          </LoadingText>
          <Loader width='75px' height='75px' />
        </Wrapper>
      ),
      NotAsked: () => <Loader width='75px' height='75px' />
    })

    return (
      <Modal size='small' position={position} total={total}>
        <ModalHeader onClose={closeModal}>
          <FormattedMessage
            id='modals.lockbox.appmanager.title'
            defaultMessage='App Manager'
          />
        </ModalHeader>
        <Wrapper>
          {connection.app !== 'DASHBOARD' ? (
            <ConnectStep>
              <Subtitle size='16px' weight={400} color='gray-4'>
                <FormattedHTMLMessage
                  id='modals.lockbox.appmanager.connectdevice'
                  defaultMessage='Connect and unlock your Lockbox device now.'
                />
              </Subtitle>
              <Image
                width='350px'
                name='lockbox-send-connect'
                srcset={{
                  'lockbox-send-connect2': '2x',
                  'lockbox-send-connect3': '3x'
                }}
              />
            </ConnectStep>
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
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  closeModal: bindActionCreators(actions.modals.closeModal, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxAppManager'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AppManagerContainer)
