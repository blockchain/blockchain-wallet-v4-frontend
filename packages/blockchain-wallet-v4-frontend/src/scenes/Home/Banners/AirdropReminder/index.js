import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'

import { Button, Icon, Text } from 'blockchain-info-components'
import { actions, model } from 'data'

const { CAMPAIGNS } = model.components.identityVerification
const { TIERS } = model.profile

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
export const AirdropReminderBanner = ({
  campaign,
  createRegisterUserCampaign,
  isSunRiverTagged,
  verifyIdentity
}) => (
  <Wrapper>
    <Column>
      <LargeText>
        <FormattedMessage
          defaultMessage='Complete your profile today and we will airdrop $25 of free {coinName} ({coinCode}) in your Wallet.'
          id='scenes.home.banners.airdrop.completeprofile'
          values={{
            coinName: prop('coinName', CAMPAIGNS[campaign]),
            coinCode: prop('coinCode', CAMPAIGNS[campaign])
          }}
        />
      </LargeText>
    </Column>
    <Column>
      <GetStartedButton
        onClick={() =>
          isSunRiverTagged ? verifyIdentity() : createRegisterUserCampaign()
        }
      >
        <FormattedMessage
          id='scenes.home.banners.airdrop.started'
          defaultMessage='Get Free Crypto'
        />
        <Icon color='white' weight={500} name='short-right-arrow' />
      </GetStartedButton>
    </Column>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  createRegisterUserCampaign: () =>
    dispatch(
      actions.components.identityVerification.createRegisterUserCampaign()
    ),
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(TIERS[2]))
})

export default connect(
  null,
  mapDispatchToProps
)(AirdropReminderBanner)
