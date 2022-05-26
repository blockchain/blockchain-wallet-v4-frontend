import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Image, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import Form from 'components/Form/Form'
import { actions, model } from 'data'
import { CampaignsType } from 'data/types'

const { ID_VERIFICATION_SUBMITTED_FORM } = model.components.identityVerification

const Wrapper = styled.div`
  margin-top: 100px;
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

class Submitted extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  componentDidMount() {
    const { campaign, identityVerificationActions } = this.props
    if (campaign) {
      identityVerificationActions.claimCampaignClicked({ campaign })
    }
  }

  render() {
    const { onClose, submitting } = this.props

    return (
      <FlyoutContainer>
        <FlyoutContent mode='middle'>
          <Wrapper>
            <Image name='user-success' style={{ marginBottom: '50px' }} />
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
              <Text color='grey600' size='16px' style={{ marginTop: '20px' }}>
                <FormattedMessage
                  id='modals.exchange.identityverification.submitted.whileyouwait'
                  defaultMessage='While you wait, you can still trade and move currency up to your current limit.'
                />
              </Text>
            </NextSteps>
          </Wrapper>
        </FlyoutContent>

        <FlyoutFooter collapsed>
          <Form>
            {submitting && <HeartbeatLoader height='32px' width='32px' color='blue500' />}
            <Button
              data-e2e='kycSubmittedDone'
              nature='primary'
              disabled={submitting}
              onClick={onClose}
              fullwidth
            >
              <FormattedMessage id='buttons.done' defaultMessage='Done' />
            </Button>
          </Form>
        </FlyoutFooter>
      </FlyoutContainer>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(null, mapDispatchToProps)

const enhance = compose(reduxForm({ form: ID_VERIFICATION_SUBMITTED_FORM }), connector)

type OwnProps = { campaign?: CampaignsType; onClose: () => void }

type Props = ConnectedProps<typeof connector> & OwnProps

export default enhance(Submitted) as React.ComponentClass<OwnProps>
