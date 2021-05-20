import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import { actions, model } from 'data'
import { CampaignsType } from 'data/types'

const { ID_VERIFICATION_SUBMITTED_FORM } = model.components.identityVerification

const SubmittedWrapper = styled.div`
  display: flex;
  height: 100%;
  padding: 48px;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const NextSteps = styled.div`
  margin: 42px 0;
`

const CloseButton = styled(Button)`
  margin: 30px auto 0;
  height: 48px;
  font-size: 16px;
  width: 210px;
  min-width: 210px;
`

class Submitted extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props
> {
  componentDidMount() {
    const { campaign, identityVerificationActions } = this.props
    if (campaign) {
      identityVerificationActions.claimCampaignClicked(campaign)
    }
  }

  render() {
    const { onClose, submitting } = this.props

    return (
      <FlyoutWrapper>
        <SubmittedWrapper>
          <Icon name='checkmark-in-circle-filled' color='success' size='36px' />
          <Text color='grey900' size='20px' weight={600} lineHeight='30px'>
            <FormattedMessage
              id='modals.exchange.identityverification.submitted.appsubmitted'
              defaultMessage='Application Submitted'
            />
          </Text>
          <Text color='grey600' size='16px' style={{ marginBottom: '24px' }}>
            <FormattedMessage
              id='modals.exchange.identityverification.submitted.subheader2'
              defaultMessage="You've successfully submitted your application. A Blockchain Support Member will review your information."
            />
          </Text>
          <NextSteps>
            <Text color='grey900' size='16px' weight={600} lineHeight='30px'>
              <FormattedMessage
                id='modals.exchange.identityverification.submitted.nextstepsheader'
                defaultMessage='What happens next?'
              />
            </Text>
            <Text color='grey600' size='16px'>
              <FormattedMessage
                id='modals.exchange.identityverification.submitted.view_status'
                defaultMessage='You can view your application status by navigating to Settings and selecting Profile.'
              />
            </Text>
            <Text color='grey600' size='16px'>
              <FormattedMessage
                id='modals.exchange.identityverification.submitted.whileyouwait'
                defaultMessage='While you wait, you can still trade and move currency up to your current limit.'
              />
            </Text>
          </NextSteps>
          <Form>
            {submitting && (
              <HeartbeatLoader height='32px' width='32px' color='blue500' />
            )}
            <CloseButton
              data-e2e='kycSubmittedDone'
              nature='empty-secondary'
              disabled={submitting}
              onClick={onClose}
            >
              <FormattedMessage id='buttons.done' defaultMessage='Done' />
            </CloseButton>
          </Form>
        </SubmittedWrapper>
      </FlyoutWrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const connector = connect(null, mapDispatchToProps)

const enhance = compose(
  reduxForm({ form: ID_VERIFICATION_SUBMITTED_FORM }),
  connector
)

type OwnProps = { campaign?: CampaignsType; onClose: () => void }

type Props = ConnectedProps<typeof connector> & OwnProps

export default enhance(Submitted) as React.ComponentClass<OwnProps>
