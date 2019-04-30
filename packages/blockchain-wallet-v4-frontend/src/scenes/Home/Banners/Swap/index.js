import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Image, Text } from 'blockchain-info-components'
import { actions, model } from 'data'
const { TIERS } = model.profile

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #0d0d42;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 15px;

  @media (min-width: 1200px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    height: 88px;
    background: #0d0d42 url(/img/swap-dashboard-left.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: -10px 0px;
    padding-left: 124px;
    padding-right: 30px;
    box-sizing: border-box;
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
  size: '20px',
  weight: 500
})``
const MediumText = styled(Text).attrs({
  color: 'white',
  size: '14px',
  weight: 400
})``
const BackgroundImage = styled(Image)`
  display: none;
  height: 125%;
  @media (max-width: 1199px) {
    display: block;
  }
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  width: '200px',
  height: '40px'
})`
  font-weight: 500;
  @media (max-width: 1199px) {
    margin-top: 15px;
  }
`
export const SwapBanner = ({
  kycNotFinished,
  hideSwapBanner,
  verifyIdentity
}) => (
  <Wrapper>
    <Column>
      <LargeText>
        <FormattedMessage
          defaultMessage="Trading Your Crypto Doesn't Mean Trading Away Control."
          id='scenes.home.banners.swap.title_1'
        />
      </LargeText>
      <MediumText>
        <FormattedMessage
          defaultMessage='Trade crypto straight from your Wallet.'
          id='scenes.home.banners.swap.subtitle_1'
        />
      </MediumText>
    </Column>
    <Column hiddenOnMobile>
      <BackgroundImage name='swap-dashboard-right' />
    </Column>
    <Column>
      {kycNotFinished && (
        <GetStartedButton onClick={verifyIdentity}>
          <FormattedMessage
            id='scenes.home.banners.swap.started'
            defaultMessage='Get Started'
          />
        </GetStartedButton>
      )}
      {!kycNotFinished && (
        <LinkContainer to='/swap'>
          <GetStartedButton onClick={hideSwapBanner}>
            <FormattedMessage
              id='scenes.home.banners.swap.swapnow'
              defaultMessage='Swap Now'
            />
          </GetStartedButton>
        </LinkContainer>
      )}
    </Column>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(TIERS[2])),
  hideSwapBanner: () => dispatch(actions.preferences.hideSwapBanner())
})

export default connect(
  null,
  mapDispatchToProps
)(SwapBanner)
