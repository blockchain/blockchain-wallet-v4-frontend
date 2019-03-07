import React from 'react'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { prop } from 'ramda'

import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { actions, model } from 'data'

const { CAMPAIGNS } = model.components.identityVerification

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 150px;
  background-color: #0d0d42;
  border-radius: 4px;
  padding: 0 15px;
  margin-top: 15px;
  box-sizing: border-box;
  overflow: hidden;
  background-size: cover;
  background: url(/img/airdrop-sunriver-dashboard.png);

  @media (min-width: 1200px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    height: 88px;
    padding: 0 30px;
    box-sizing: border-box;
    background-size: cover;
    background-repeat: no-repeat;
  }
`

const Column = styled.div`
  display: ${props => (props.hiddenOnMobile ? 'none' : 'flex')};
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;

  & > :not(:first-child) {
    margin-top: 10px;
  }

  @media (min-width: 1200px) {
    display: flex;
    &:first-child {
      width: 50%;
    }
  }
`
const LargeText = styled(Text).attrs({
  color: 'white',
  size: '16px',
  weight: 500
})``
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  width: '200px',
  height: '40px'
})`
  font-weight: 500;
  span:last-child {
    margin-left: 8px;
  }
`
export const AirdropReminderBanner = ({ actions, campaign, submitting }) => (
  <Wrapper>
    <Column>
      <LargeText>
        <FormattedMessage
          defaultMessage='Congrats! You are eligible for our airdrop program. We are giving away $25 of {coinName} ({coinCode}) for free. Click the button and we will send it your way.'
          id='scenes.home.banners.airdropclaim.title_1'
          values={{
            coinName: prop('coinName', CAMPAIGNS[campaign]),
            coinCode: prop('coinCode', CAMPAIGNS[campaign])
          }}
        />
      </LargeText>
    </Column>
    <Column>
      <Form
        onSubmit={e => {
          e.preventDefault()
          actions.airdropClaimSubmitClicked(campaign)
        }}
      >
        <GetStartedButton type='submit' disabled={submitting}>
          {submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage
              id='scenes.home.banners.airdrop.getfreecrypto'
              defaultMessage='Get Free Crypto'
            />
          )}
        </GetStartedButton>
      </Form>
    </Column>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onboarding, dispatch)
})

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  reduxForm({ form: 'airdropClaim' })
)

export default enhance(AirdropReminderBanner)
