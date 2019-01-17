import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import { actions, model } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'

const { TIERS } = model.profile

const WelcomeModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']};
  }
`
const Container = styled.div`
  text-align: center;
  > div:nth-child(2) {
    margin: 10px 0 20px 0;
  }
`

class SunRiverWelcomeContainer extends React.PureComponent {
  // Only for users that are created but have not finished verification
  continueVerification = () => {
    this.props.modalActions.closeModal()
    this.props.identityVerificationActions.verifyIdentity(TIERS[2])
  }

  // Only for new users that have not started verification
  goToIdentityVerification = () => {
    this.props.modalActions.closeModal()
    this.props.identityVerificationActions.createRegisterUserCampaign()
  }

  // Only for users who have completed/pending/under_review verification
  viewStellarWallet = () => {
    this.props.modalActions.closeModal()
    this.props.routerActions.push('/xlm/transactions')
  }

  determineKycState (userState, kycState) {
    // always register the campaign as quickly as possible if user has been created
    if (userState !== USER_ACTIVATION_STATES.NONE) {
      this.props.identityVerificationActions.registerUserCampaign()
    }

    if (kycState === KYC_STATES.VERIFIED) {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.title'
              defaultMessage='Thank you for already verifying your identity'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.subtitle'
              defaultMessage='Hang tight, your XLM is on its way.'
            />
          </Text>
          <Button nature='primary' fullwidth onClick={this.viewStellarWallet}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.seewallet'
              defaultMessage='View Stellar Wallet'
            />
          </Button>
        </Container>
      )
    } else if (
      userState === USER_ACTIVATION_STATES.ACTIVE &&
      (kycState === KYC_STATES.UNDER_REVIEW || kycState === KYC_STATES.PENDING)
    ) {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.title'
              defaultMessage='Thank you for completing your Identity Verification'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.subtitle'
              defaultMessage='Your application is still under review. Once verified, you will receive your XLM.'
            />
          </Text>
          <Button nature='primary' fullwidth onClick={this.viewStellarWallet}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.seewallet'
              defaultMessage='View Stellar Wallet'
            />
          </Button>
        </Container>
      )
    } else if (
      userState === USER_ACTIVATION_STATES.CREATED ||
      userState === USER_ACTIVATION_STATES.ACTIVE
    ) {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.title'
              defaultMessage='Finish Identity Verification'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.subtitle'
              defaultMessage="Complete your Identity Verification to claim your XLM. Once verified, you'll be able to use our next generation trading product, Swap."
            />
          </Text>
          <Button
            nature='primary'
            fullwidth
            onClick={this.continueVerification}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.completenow'
              defaultMessage='Complete Now'
            />
          </Button>
        </Container>
      )
    } else {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.title'
              defaultMessage='Start Identity Verification'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.subtitle'
              defaultMessage="Verify your identity to claim your XLM. It only takes a few minutes. Once verified, you'll be able to use our next generation trading product, Swap."
            />
          </Text>
          <Button
            nature='primary'
            fullwidth
            onClick={this.goToIdentityVerification}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.beginenow'
              defaultMessage='Begin Now'
            />
          </Button>
        </Container>
      )
    }
  }

  render () {
    const { data, position, total, close } = this.props
    return data.cata({
      Success: value => (
        <Modal size='medium' position={position} total={total}>
          <WelcomeModalHeader onClose={close} />
          <Image name='airdrop-welcome' width='100%' />
          <ModalBody>
            {this.determineKycState(value.userState, value.kycState)}
          </ModalBody>
        </Modal>
      ),
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('SunRiverWelcome'),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(SunRiverWelcomeContainer)
