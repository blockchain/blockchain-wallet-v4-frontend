import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  BlockchainLoader,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import * as Lockbox from 'services/LockboxService'
import LockboxAppManager from './template'

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
const InstallTexts = styled(TextGroup)`
  text-align: center;
  margin-top: 12px;
  & > :last-child {
    margin-left: -3px;
  }
`

const getKeyByValue = value => {
  return Object.keys(Lockbox.constants.supportedApps).find(
    key => Lockbox.constants.supportedApps[key] === value
  )
}

class LockboxAppManagerContainer extends React.PureComponent {
  state = { appName: '', changeType: '' }

  componentDidMount () {
    this.props.lockboxActions.initializeAppManager(this.props.deviceIndex)
  }

  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
    this.props.lockboxActions.resetConnectionStatus()
  }

  onAppInstall = (appName, coin) => {
    this.setState({ changeType: 'Installing', appName })
    this.props.lockboxActions.installApplication(coin)
  }

  onAppUninstall = appName => {
    this.setState({ changeType: 'Uninstalling', appName })
    this.props.lockboxActions.uninstallApplication(appName)
  }

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  onContinue = () => {
    this.setState({ changeType: '', appName: '' })
    this.props.lockboxActions.resetAppChangeStatus()
  }

  render () {
    const {
      appChangeStatus,
      appVersionInfos,
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
              defaultMessage='{changeType} the {appName} application was successful!'
              values={{
                appName: this.state.appName,
                changeType: this.state.changeType
              }}
            />
          </LoadingText>
          <Image
            name='lockbox-success'
            width='330px'
            srcset={{
              'lockbox-success2': '2x',
              'lockbox-success3': '3x'
            }}
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
              defaultMessage='{changeType} the {appName} application has failed!'
              values={{
                appName: this.state.appName,
                changeType: this.state.changeType
              }}
            />
          </LoadingText>
          <Image
            name='lockbox-failed'
            width='330px'
            srcset={{
              'lockbox-failed2': '2x',
              'lockbox-failed3': '3x'
            }}
          />
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
              defaultMessage='{changeType} the {appName} application {direction} your device.'
              values={{
                appName: this.state.appName,
                changeType: this.state.changeType,
                direction:
                  this.state.changeType === 'Installing' ? 'onto' : 'from'
              }}
            />
          </LoadingText>
          <Loader width='75px' height='75px' />
          <InstallTexts inline>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.lockbox.appmanager.note'
                defaultMessage='Note:'
              />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage
                id='modals.lockbox.appmanager.notetext'
                defaultMessage='Allow the device manager onto the device if prompted.'
              />
            </Text>
          </InstallTexts>
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
            <LockboxAppManager
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
            <ContinueButton onClick={this.onClose} nature='primary' fullwidth>
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
              id='modals.lockbox.appmanager.loadingapplist'
              defaultMessage='Loading application list'
            />
            &hellip;
          </LoadingText>
          <Loader width='100px' height='100px' />
        </Wrapper>
      ),
      NotAsked: () => <Loader width='75px' height='75px' />
    })

    return (
      <Modal size='small' position={position} total={total}>
        <ModalHeader onClose={this.onClose}>
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
                  defaultMessage='Connect, unlock and open the Dashboard on your Lockbox device now.'
                />
              </Subtitle>
              <Image
                width='330px'
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

LockboxAppManagerContainer.propTypes = {
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

export default enhance(LockboxAppManagerContainer)
