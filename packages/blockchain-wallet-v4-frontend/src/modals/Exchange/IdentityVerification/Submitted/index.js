import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import CopyToClipBoard from 'react-copy-to-clipboard'
import React from 'react'
import styled from 'styled-components'

import { actions, model, selectors } from 'data'
import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TooltipHost
} from 'blockchain-info-components'
import { Form } from 'components/Form'
import { IdentityVerificationForm } from 'components/IdentityVerification'

const { ID_VERIFICATION_SUBMITTED_FORM } = model.components.identityVerification

const SubmittedIdentityVerificationForm = styled(IdentityVerificationForm)`
  justify-content: center;
`

const SubmittedWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 475px;
  padding: 48px;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const Header = styled(Text).attrs({
  size: '30px',
  weight: 500,
  color: 'black'
})`
  margin-top: 24px;
`
const SubHeader = styled(Text).attrs({
  size: '16px',
  weight: 400
})`
  margin-top: 16px;
`
const NextSteps = styled.div`
  margin: 42px 0;
`
const NextStepsHeader = styled(Text).attrs({
  size: '22px',
  color: 'black',
  weight: '500'
})``
const NextStepsSubHeader = styled(Text).attrs({
  size: '13px',
  weight: 400
})`
  margin-top: 16px;
`
const ClaimButton = styled(Button)`
  margin: 0 auto 40px;
  height: 48px;
  font-size: 16px;
  width: 210px;
  min-width: 210px;
`
const CloseButton = styled(Button)`
  margin: 30px auto 0;
  height: 48px;
  font-size: 16px;
  width: 210px;
  min-width: 210px;
`
const Footer = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: space-around;
  align-items: center;
  height: auto;
  padding: 0 24px 32px 24px;
  box-sizing: border-box;
`
const FooterButton = styled(Button)`
  height: 48px;
  font-weight: 400;
  min-width: auto;
  padding: 14px;
`
const FooterIcon = styled(Icon).attrs({
  color: 'white'
})`
  margin-right: 12px;
`

class Submitted extends React.PureComponent {
  state = {
    initialIsSunRiverTagged: this.props.isSunRiverTagged
  }

  handleCopy = () => {
    this.setState({ isLinkCopied: true })
    setTimeout(() => {
      this.setState({ isLinkCopied: false })
    }, 3000)
  }

  hideCopied = () => {
    this.setState({ isLinkCopied: false })
  }

  render () {
    const {
      campaign,
      onClose,
      identityVerificationActions,
      submitting
    } = this.props
    const { initialIsSunRiverTagged } = this.state
    const { isLinkCopied } = this.state
    const link = 'https://www.blockchain.com/getcrypto'
    const tweetLink =
      'https://twitter.com/intent/tweet?text=' +
      `I just enrolled in @blockchain's Airdrop Program so that I'm ready for their next %23crypto airdrop. Click below to learn more 👇 ${link}`
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${link}`

    return (
      <SubmittedIdentityVerificationForm>
        <SubmittedWrapper>
          <Icon name='checkmark-in-circle-filled' color='success' size='36px' />
          <Header>
            <FormattedMessage
              id='modals.exchange.identityverification.submitted.appcomplete'
              defaultMessage='Application Complete!'
            />
          </Header>
          <SubHeader>
            <FormattedMessage
              id='modals.exchange.identityverification.submitted.subheader2'
              defaultMessage="You've successfully submitted your application. A Blockchain Support Member will review your information."
            />
          </SubHeader>
          <NextSteps>
            <NextStepsHeader>
              <FormattedMessage
                id='modals.exchange.identityverification.submitted.nextstepsheader'
                defaultMessage='What happens next?'
              />
            </NextStepsHeader>
            <NextStepsSubHeader>
              <FormattedHTMLMessage
                id='modals.exchange.identityverification.submitted.mayaskforid3'
                defaultMessage='You can check your application status by navigating to Settings > Profile. If something looks odd, we may ask you to upload another form of ID.'
              />
            </NextStepsSubHeader>
            <NextStepsSubHeader>
              <FormattedMessage
                id='modals.exchange.identityverification.submitted.whileyouwait'
                defaultMessage='While you wait, you can still trade and move currency up to your current limit.'
              />
            </NextStepsSubHeader>
          </NextSteps>
          <Form
            onSubmit={e => {
              e.preventDefault()
              identityVerificationActions.claimCampaignClicked(campaign)
            }}
          >
            {initialIsSunRiverTagged ? (
              <React.Fragment>
                <Text color='black' size='20px'>
                  <FormattedMessage
                    id='modals.exchange.identityverification.submitted.freecrypto2'
                    defaultMessage="Don't forget to share this opportunity with friends and family!"
                  />
                </Text>
                <Footer>
                  <Link
                    href={tweetLink}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <FooterButton nature='primary' size='16px'>
                      <FooterIcon name='twitter' size='18px' />
                      <FormattedMessage
                        defaultMessage='Tweet'
                        id='modals.airdropsuccess.tweet'
                      />
                    </FooterButton>
                  </Link>
                  <Link
                    href={facebookLink}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <FooterButton nature='secondary' size='16px'>
                      <FooterIcon name='facebook' size='18px' />
                      <FormattedMessage
                        defaultMessage='Share'
                        id='modals.airdropsuccess.share'
                      />
                    </FooterButton>
                  </Link>
                  <CopyToClipBoard text={link} onCopy={this.handleCopy}>
                    {isLinkCopied ? (
                      <TooltipHost id='copied'>
                        <FooterButton
                          nature='purple'
                          size='16px'
                          onMouseLeave={this.hideCopied}
                        >
                          <FooterIcon name='copy' size='12px' />
                          <FormattedMessage
                            defaultMessage='Copy'
                            id='modals.airdropsuccess.copy'
                          />
                        </FooterButton>
                      </TooltipHost>
                    ) : (
                      <FooterButton nature='purple' size='16px'>
                        <FooterIcon name='copy' size='12px' />
                        <FormattedMessage
                          defaultMessage='Copy'
                          id='modals.airdropsuccess.copy'
                        />
                      </FooterButton>
                    )}
                  </CopyToClipBoard>
                </Footer>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ClaimButton
                  nature='primary'
                  type='submit'
                  disabled={submitting}
                >
                  {submitting ? (
                    <HeartbeatLoader height='20px' width='20px' color='white' />
                  ) : (
                    <FormattedMessage
                      id='modals.exchange.identityverification.submitted.enterairdrop'
                      defaultMessage='Enter Airdrop Program'
                    />
                  )}
                </ClaimButton>
                <NextStepsSubHeader>
                  <FormattedMessage
                    id='modals.exchange.identityverification.submitted.makesuretoclick3'
                    defaultMessage="By tapping on 'Enter Airdrop Program', you'll be eligible to receive future airdrops extended to your region."
                  />
                </NextStepsSubHeader>
                <CloseButton
                  nature='empty-secondary'
                  disabled={submitting}
                  onClick={onClose}
                >
                  <FormattedMessage
                    id='modals.exchange.identityverification.submitted.close'
                    defaultMessage='Close'
                  />
                </CloseButton>
              </React.Fragment>
            )}
          </Form>
        </SubmittedWrapper>
      </SubmittedIdentityVerificationForm>
    )
  }
}

Submitted.defaultProps = {
  campaign: 'BLOCKSTACK'
}

const mapStateToProps = state => ({
  isSunRiverTagged: selectors.modules.profile
    .getSunRiverTag(state)
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const enhance = compose(
  reduxForm({ form: ID_VERIFICATION_SUBMITTED_FORM }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(Submitted)
