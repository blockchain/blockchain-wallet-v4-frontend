import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { getData } from './selectors'
import background1 from './swap-background-1.svg'
import background2 from './swap-background-2.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 150px;
  background: none;
  background-color: #0d0d42;
  border-radius: 4px;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 15px;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    height: 88px;
    background: #0d0d42 url(${background1});
    background-repeat: no-repeat;
    background-size: auto;
    background-position: -15px -10px;
    padding-left: 75px;
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
const BackgroundImage = styled.img.attrs({
  src: background2
})`
  display: none;
  height: 100%;
  @media (min-width: 1200px) {
    display: block;
  }
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  width: '200px',
  height: '40px'
})`
  font-weight: 500;
`

export const SwapBanner = ({ showBanner, verifyIdentity }) =>
  showBanner ? (
    <Wrapper>
      <Column>
        <LargeText>
          <FormattedMessage
            defaultMessage="We've improved your Exchange"
            id='scenes.home.swapbanner.improved'
          />
        </LargeText>
        <MediumText>
          <FormattedMessage
            defaultMessage='A faster, smarter way to trade your crypto.'
            id='scenes.home.swapbanner.faster'
          />
        </MediumText>
      </Column>
      <Column hiddenOnMobile>
        <BackgroundImage />
      </Column>
      <Column>
        <GetStartedButton onClick={verifyIdentity}>
          <FormattedMessage
            defaultMessage='Get Started'
            id='scenes.home.swapbanner.getstarted'
          />
        </GetStartedButton>
      </Column>
    </Wrapper>
  ) : null

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwapBanner)
