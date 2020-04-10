import { FormattedMessage } from 'react-intl'
import {
  Icon,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import TierCard from 'components/IdentityVerification/TierCard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  position: relative;
  box-sizing: border-box;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;

  @media (min-width: 1024px) {
    justify-content: center;
    width: 100%;
  }
`
const Column = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: auto;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    width: 'auto';
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
  flex-wrap: wrap;

  @media (min-width: 1200px) {
    flex-direction: row;
    width: '100%';
    margin-bottom: 'none';
  }
`
const TierRow = styled(Row)`
  margin-top: 10px;
  @media (min-width: 1200px) {
    align-items: flex-start;
    > :first-child {
      padding-top: 50px;
    }
  }
`
const SwapText = styled(Text)`
  margin-bottom: 10px;
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
  }
`
const TierWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 16px;
  ${media.laptop`
    width: 100%;
  `} > div:not(:first-child) {
    top: 14px;
    right: -40px;
    height: 24px;
    margin-left: 4px;
    position: absolute;
    ${media.laptop`
      display: none;
    `};
  }
`
const SecurityColumn = styled(Column)`
  max-width: 440px;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
`
const GoBackLink = styled.div`
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 5px;
  position: absolute;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 20px;
  left: 0;
  top: 0;
  box-shadow: 0px;
  transition: box-shadow 0.3s;
  span {
    transform: rotate(90deg);
  }
  &:hover {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  }
  ${media.mobile`
    display: none;
  `};
`

const IdentityVerification = () => {
  return (
    <Wrapper>
      <LinkContainer to='/swap'>
        <GoBackLink>
          <Icon name='chevron-down-large' color='blue600' />
        </GoBackLink>
      </LinkContainer>
      <Container>
        <Row>
          <Column>
            <SwapText size='32px' color='marketing-secondary'>
              <FormattedMessage
                id='scenes.exchange.exchangeprofile.pagetitle'
                defaultMessage='Blockchain Swap'
              />
            </SwapText>
            <SwapText>
              <FormattedMessage
                id='scenes.exchange.exchangeprofile.explaination'
                defaultMessage='Get verified and trade crypto in minutes.'
              />
            </SwapText>
          </Column>
        </Row>
        <TierRow>
          <TierWrapper>
            <TierCard tier={1} column />
          </TierWrapper>
          <TierWrapper>
            <TierCard tier={2} column />
            <TooltipHost id='swaplimit.airdrops.tooltip' data-place='right'>
              <TooltipIcon
                size='24px'
                name='question-in-circle-filled'
                color='grey200'
              />
            </TooltipHost>
          </TierWrapper>
        </TierRow>
        <SecurityColumn>
          <Icon name='lock' size='32px' />
          <Text weight={400}>
            <FormattedMessage
              id='scenes.exchange.exchangeprofile.encryption'
              defaultMessage='Your information is kept safe with bank level security
  and 256 bit encryption.'
            />
          </Text>
        </SecurityColumn>
      </Container>
    </Wrapper>
  )
}

export default IdentityVerification
