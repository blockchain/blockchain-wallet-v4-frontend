import React from 'react'
import { reduxForm } from 'redux-form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { compose, bindActionCreators } from 'redux'
import { prop } from 'ramda'
import { connect } from 'react-redux'
import styled from 'styled-components'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { actions, model, selectors } from 'data'
import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  TooltipHost,
  Text
} from 'blockchain-info-components'
import { Form } from 'components/Form'
import { IdentityVerificationForm } from 'components/IdentityVerification'

const {
  CAMPAIGNS,
  ID_VERIFICATION_SUBMITTED_FORM
} = model.components.identityVerification

const SubmittedIdentityVerificationForm = styled(IdentityVerificationForm)`
  justify-content: center;
`

const SubmittedWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 520px;
  padding: 48px;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const Header = styled(Text).attrs({
  size: '24px',
  weight: 500,
  color: 'black'
})`
  margin-top: 24px;
`
const SubHeader = styled(Text).attrs({
  size: '16px',
  weight: 300
})`
  margin-top: 16px;
`
const NextSteps = styled.div`
  margin: 42px 0;
`
const NextStepsHeader = styled(Text).attrs({
  size: '20px',
  color: 'black'
})``
const NextStepsSubHeader = styled(Text).attrs({
  size: '12px',
  weight: 300
})`
  margin-top: 16px;
`
const ClaimButton = styled(Button)`
  margin: 0 auto;
  height: 56px;
  font-size: 18px;
  min-width: 200px;
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
    const { campaign, identityVerificationActions, submitting } = this.props
    const { initialIsSunRiverTagged } = this.state
    const { isLinkCopied } = this.state
    const link = 'https://www.blockchain.com/getcrypto/claim'
    const tweetLink =
      'https://twitter.com/intent/tweet?text=' +
      `I just claimed free ${prop('coinName', CAMPAIGNS[campaign])} ${prop(
        'coinCode',
        CAMPAIGNS[campaign]
      )} from @blockchain. Get Yours ${link}`
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
                id='modals.exchange.identityverification.submitted.mayaskforid2'
                defaultMessage="You'll hear back from us in the <b>next 5 business days</b>. If something looks odd, we may have to ask you to upload another form of ID."
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
                    id='modals.exchange.identityverification.submitted.makesuretoclick2'
                    defaultMessage='By entering the airdrop program you’ll become eligible to receive future airdrops.'
                  />
                </NextStepsSubHeader>
              </React.Fragment>
            )}
          </Form>
        </SubmittedWrapper>
      </SubmittedIdentityVerificationForm>
    )
  }
}

Submitted.defaultProps = {
  campaign: 'sunriver'
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
