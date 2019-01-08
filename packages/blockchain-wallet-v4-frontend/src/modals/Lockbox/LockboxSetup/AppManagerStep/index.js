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
  Text,
  TextGroup
} from 'blockchain-info-components'
import AppManagerStep from './template'
// import LockboxAppManager from './../../LockboxAppManager/template'

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

class AppManagerStepContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.resetAppChangeStatus()
  }

  onInstallBtc = () => {
    this.props.lockboxActions.newDeviceBtcInstall()
  }

  onStepChange = () => {
    this.props.lockboxActions.changeDeviceSetupStep('pair-device')
  }

  render () {
    const { appChangeStatus } = this.props

    return appChangeStatus.cata({
      Success: () => (
        <AppManagerStep
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
        </AppManagerStep>
      ),
      Failure: () => (
        <AppManagerStep
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
        </AppManagerStep>
      ),
      Loading: () => (
        <AppManagerStep isInstalling continueBtnText={'Installing Application'}>
          <GraphicContainer>
            <BlockchainLoader width='75px' height='75px' />
          </GraphicContainer>
        </AppManagerStep>
      ),
      NotAsked: () => (
        <AppManagerStep
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
        </AppManagerStep>
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
)(AppManagerStepContainer)
