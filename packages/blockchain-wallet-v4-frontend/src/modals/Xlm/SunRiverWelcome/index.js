import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import styled from 'styled-components'

import { actions, model } from 'data'
import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { getData } from './selectors'

const { TIERS } = model.profile

const AbsoluteModalHeader = styled(ModalHeader)`
  position: absolute;
  border: none;
  > span {
    &:hover {
      cursor: pointer;
    }
  }
  z-index: 99;
`
const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-top: 24px;
`
const Header = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  margin-top: 18px;
  color: ${props => props.theme['grey800']};
`
const Container = styled.div`
  text-align: center;
  > div:nth-child(2) {
    margin: 10px auto 20px auto;
  }
`
const Copy = styled(Text)`
  margin-top: 16px;
  font-weight: 500;
  max-width: 300px;
  color: ${props => props.theme['grey800']};
`
const FooterButton = styled(Button)`
  height: 56px;
  font-weight: 500;
  margin-top: 24px;
  font-size: 16px;
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
          <Header>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.title'
              defaultMessage='Thank you for already verifying your identity'
            />
          </Header>
          <Copy>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.subtitle2'
              defaultMessage='If you are eligible for the airdrop we’ll notify you once it’s ready! Thanks for you patience'
            />
          </Copy>
          <LinkContainer to='/xlm/transactions'>
            <FooterButton nature='primary' fullwidth>
              <FormattedMessage
                id='modals.xlmairdropwelcome.verified.seewallet'
                defaultMessage='View Stellar Wallet'
              />
            </FooterButton>
          </LinkContainer>
        </Container>
      )
    } else if (
      userState === USER_ACTIVATION_STATES.ACTIVE &&
      (kycState === KYC_STATES.UNDER_REVIEW || kycState === KYC_STATES.PENDING)
    ) {
      return (
        <Container>
          <Header>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.title2'
              defaultMessage='Thanks for Verifying'
            />
          </Header>
          <Copy>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.subtitle3'
              defaultMessage='Your application is still under review. Once verified we’ll notify you if you are eligible for the Airdrop.'
            />
          </Copy>
          <LinkContainer to='/xlm/transactions'>
            <FooterButton nature='primary' fullwidth>
              <FormattedMessage
                id='modals.xlmairdropwelcome.underreview.seewallet'
                defaultMessage='View Stellar Wallet'
              />
            </FooterButton>
          </LinkContainer>
        </Container>
      )
    } else if (
      userState === USER_ACTIVATION_STATES.CREATED ||
      userState === USER_ACTIVATION_STATES.ACTIVE
    ) {
      return (
        <Container>
          <Header>
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.title2'
              defaultMessage='Go for Gold'
            />
          </Header>
          <Copy>
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.subtitle2'
              defaultMessage='Complete your profile to start instantly trading crypto from the security of your wallet and become eligible for our Airdrop Program.'
            />
          </Copy>
          <FooterButton
            nature='primary'
            fullwidth
            onClick={this.continueVerification}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.completenow'
              defaultMessage='Complete Now'
            />
          </FooterButton>
        </Container>
      )
    } else {
      return (
        <Container>
          <Header>
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.title'
              defaultMessage='Start Identity Verification'
            />
          </Header>
          <Copy>
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.subtitle2'
              defaultMessage='Complete your profile to start instantly trading crypto from the security of your wallet and become eligible for our Airdrop Program.'
            />
          </Copy>
          <FooterButton
            nature='primary'
            fullwidth
            onClick={this.goToIdentityVerification}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.beginenow'
              defaultMessage='Begin Now'
            />
          </FooterButton>
        </Container>
      )
    }
  }

  render () {
    const { data, position, total, close } = this.props
    return data.cata({
      Success: value => (
        <Modal size='small' position={position} total={total}>
          <AbsoluteModalHeader onClose={close} />
          <Body>
            <Image name='gold-verified' width='52px' />
            {this.determineKycState(value.userState, value.kycState)}
          </Body>
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
