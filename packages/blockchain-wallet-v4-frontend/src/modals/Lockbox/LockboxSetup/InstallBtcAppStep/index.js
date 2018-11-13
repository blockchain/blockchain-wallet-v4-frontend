import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import {
  BlockchainLoader,
  Icon,
  Image,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import InstallBtcAppStep from './template'

const GraphicContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 15px;
  margin-top: 15px;
`
const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 57%;
  margin: 30px 0;
  img {
    position: absolute;
    left: 0;
    top: 0;
  }
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
          <ImageContainer>
            <Image
              name='lockbox-success'
              width='100%'
              srcset={{
                'lockbox-success2': '2x',
                'lockbox-success3': '3x'
              }}
            />
          </ImageContainer>
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
              defaultMessage='It looks like the app may already be installed on your device. Please continue to the next step.'
            />
          </Text>
          <ImageContainer>
            <Image
              name='lockbox-failed'
              width='100%'
              srcset={{
                'lockbox-failed2': '2x',
                'lockbox-failed3': '3x'
              }}
            />
          </ImageContainer>
          <InstallTexts inline>
            <Text size='14px' weight='400'>
              <FormattedMessage
                id='modals.lockboxsetup.installbtcappstep.note'
                defaultMessage='Note:'
              />
            </Text>
            <Text size='14px' weight='300'>
              <FormattedMessage
                id='modals.lockboxsetup.installbtcappstep.failurecontact'
                defaultMessage='If you are unable to install the app or proceed past the next step, please contact support.'
              />
            </Text>
          </InstallTexts>
        </InstallBtcAppStep>
      ),
      Loading: () => (
        <InstallBtcAppStep
          isInstalling
          continueBtnText={'Installing Application'}
        >
          <GraphicContainer>
            <BlockchainLoader width='75px' height='75px' />
          </GraphicContainer>
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
