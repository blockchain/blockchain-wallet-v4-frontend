import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import React from 'react'
import styled from 'styled-components'

import { actions, model } from 'data'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { IdentityVerificationForm } from 'components/IdentityVerification'

const { ID_VERIFICATION_SUBMITTED_FORM } = model.components.identityVerification

const SubmittedIdentityVerificationForm = styled(IdentityVerificationForm)`
  justify-content: center;
`

const SubmittedWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 450px;
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
const CloseButton = styled(Button)`
  margin: 30px auto 0;
  height: 48px;
  font-size: 16px;
  width: 210px;
  min-width: 210px;
`

class Submitted extends React.PureComponent {
  componentDidMount () {
    const { identityVerificationActions, campaign } = this.props
    identityVerificationActions.claimCampaignClicked(campaign)
  }

  render () {
    const { onClose, submitting } = this.props

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
          <Form>
            {submitting && (
              <HeartbeatLoader
                height='32px'
                width='32px'
                color='blue500'
                style={{ margin: '0 auto' }}
              />
            )}
            <CloseButton
              nature='empty-secondary'
              disabled={submitting}
              onClick={onClose}
            >
              <FormattedMessage id='buttons.close' defaultMessage='Close' />
            </CloseButton>
          </Form>
        </SubmittedWrapper>
      </SubmittedIdentityVerificationForm>
    )
  }
}

Submitted.defaultProps = {
  campaign: ''
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
    null,
    mapDispatchToProps
  )
)

export default enhance(Submitted)
