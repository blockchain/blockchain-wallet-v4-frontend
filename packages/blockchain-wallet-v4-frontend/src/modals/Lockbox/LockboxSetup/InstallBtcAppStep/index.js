import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import {
  BlockchainLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import InstallBtcAppStep from './template'

const GraphicContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 14px;
  margin-top: 6px;
`
const InstallTexts = styled(TextGroup)`
  margin-top: 12px;
  & > :last-child {
    margin-left: -3px;
  }
`

class InstallBtcAppStepContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
  }

  onInstallBtc = () => {
    this.props.lockboxActions.newDeviceBtcInstall()
  }

  onStepChange = () => {
    this.props.lockboxActions.changeDeviceSetupStep('open-btc-app')
  }

  render () {
    const { appChangeStatus } = this.props

    return appChangeStatus.cata({
      Success: () => (
        <InstallBtcAppStep
          onContinue={this.onStepChange}
          continueBtnText={'Continue'}
        >
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.success'
              defaultMessage='Successfully installed the Bitcoin app!'
            />
          </Text>
          <Icon
            style={{ marginTop: '18px' }}
            name='checkmark-in-circle-filled'
            color='success'
            size='60px'
          />
        </InstallBtcAppStep>
      ),
      Failure: () => (
        <InstallBtcAppStep
          onContinue={this.onStepChange}
          continueBtnText={'Continue'}
        >
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.failure'
              defaultMessage='The attempt to install the Bitcoin app failed. This may be because the app is already on the device.'
            />
          </Text>
          <Text size='14px' weight={300} style={{ marginTop: '10px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.failurecontact'
              defaultMessage='Please continue to the next step and if you are unable to proceed, try again later or contact support.'
            />
          </Text>
        </InstallBtcAppStep>
      ),
      Loading: () => (
        <InstallBtcAppStep isInstalling continueBtnText={'Installing'}>
          <GraphicContainer>
            <BlockchainLoader width='65px' height='65px' />
          </GraphicContainer>
          <Text size='14px' weight={400} style={{ marginTop: '8px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.installing'
              defaultMessage='Installing the Bitcoin application'
            />
          </Text>
        </InstallBtcAppStep>
      ),
      NotAsked: () => (
        <InstallBtcAppStep
          onContinue={this.onInstallBtc}
          continueBtnText={'Install Application'}
        >
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.explanation'
              defaultMessage="Now let's install the Bitcoin app to your device."
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxsetup.installbtcappstep.selection'
              defaultMessage='Click button below to start the install process.'
            />
          </Text>
          <GraphicContainer>
            <Icon color={'btc'} name={`btc-circle-filled`} size='75px' />
          </GraphicContainer>
          <InstallTexts inline>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.lockboxsetup.installbtcappstep.note'
                defaultMessage='Note:'
              />
            </Text>
            <Text size='14px' weight={300}>
              <FormattedMessage
                id='modals.lockboxsetup.installbtcappstep.skipinstall'
                defaultMessage='If this device has already been setup and it has the Bitcoin app installed, click'
              />
            </Text>
            <Link size='14px' weight={400} onClick={this.onStepChange}>
              <FormattedMessage
                id='modals.lockboxsetup.installbtcappstep.skipinstallhere'
                defaultMessage='here.'
              />
            </Link>
          </InstallTexts>
        </InstallBtcAppStep>
      )
    })
  }
}

const mapStateToProps = state => ({
  appChangeStatus: selectors.components.lockbox.getAppChangeStatus(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallBtcAppStepContainer)
