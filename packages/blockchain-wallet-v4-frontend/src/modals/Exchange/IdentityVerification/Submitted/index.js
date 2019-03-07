import React from 'react'
import { reduxForm } from 'redux-form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions, model } from 'data'
import { Button, Icon, HeartbeatLoader, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { IdentityVerificationForm } from 'components/IdentityVerification'

const { ID_VERIFICATION_SUBMITTED_FORM } = model.components.identityVerification

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

const Submitted = ({ campaign, identityVerificationActions, submitting }) => (
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
          id='modals.exchange.identityverification.submitted.subheader'
          defaultMessage="You've successfully submitted your application. A Blockchain Support Member is now reviewing your information."
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
            id='modals.exchange.identityverification.submitted.mayaskforid'
            defaultMessage="You'll hear back from us in the next <b>5 business days</b>. If something looks odd, we may have to ask you to upload another form of ID."
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
        <ClaimButton nature='primary' type='submit' disabled={submitting}>
          {submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage
              id='modals.exchange.identityverification.submitted.claim'
              defaultMessage='Claim Free XLM'
            />
          )}
        </ClaimButton>
        <NextStepsSubHeader>
          <FormattedMessage
            id='modals.exchange.identityverification.submitted.makesuretoclick'
            defaultMessage='Once your verification is successfully completed, we’ll send you free crypto. Make sure you click the button to claim your free XLM.'
          />
        </NextStepsSubHeader>
      </Form>
    </SubmittedWrapper>
  </SubmittedIdentityVerificationForm>
)

Submitted.defaultProps = {
  campaign: 'sunriver'
}

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const enhance = compose(
  reduxForm({ form: ID_VERIFICATION_SUBMITTED_FORM }),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(Submitted)
