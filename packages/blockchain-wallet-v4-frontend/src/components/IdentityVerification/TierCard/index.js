import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { all, head, path, propEq, toLower } from 'ramda'
import { connect } from 'react-redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import { Button, Text, TextGroup, Icon } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

import { TIERS } from './model'
import { messages, limits, status } from './services'

const Wrapper = styled.div`
  display: flex;
  border-radius: 8px;
  position: relative;
  flex-direction: column;
  border: 1px solid ${props => props.theme['gray-1']};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  width: 375px;
  &.column {
    width: 260px;
  }
  &.rejected {
    filter: grayscale(100%);
    box-shadow: none;
    opacity: 0.9;
  }
  ${media.laptop`
    width: 100%;
    &.column {
      width: 100%;
    }
  `};
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`
const Header = styled(Text)`
  display: flex;
  text-align: center;
  align-items: center
  width: 50%;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 2px;
  ${Wrapper}.column & {
    width: 100%;
    justify-content: center;
  }
`
const Row = styled.div`
  display: flex;
  ${Wrapper}.column & {
    flex-direction: column;
  }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width || '100%'};
  &:first-child {
    margin-right: 20px;
    border-right: 1px solid ${props => props.theme['gray-1']};
  }
  ${Wrapper}.column & {
    text-align: center;
    &:first-child {
      margin-right: 0px;
      border-right: 0px;
      border-bottom: 1px solid ${props => props.theme['gray-1']};
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
  }
`
const Announcement = styled(Text)`
  display: flex;
  background: linear-gradient(180deg, #162241 0%, #324069 100%);
  border-radius: 8px 8px 0 0;
  justify-content: center;
  align-items: center;
  letter-spacing: 2px;
  height: 50px;
`
const Content = styled.div`
  margin-top: 10px;
`
export const ActionButton = styled(Button)`
  margin-top: 20px;
`

const { TIERS_STATES } = model.profile

export const TierCard = ({
  userData,
  userTiers,
  emailVerified,
  mobileVerified,
  verifyIdentity,
  column,
  tier,
  goToSwap
}) => {
  const tierData = head(userTiers.filter(propEq('index', tier)))
  const symbol =
    Exchange.getSymbol(tierData.limits.currency) +
    Currency.formatFiat(
      tierData.limits[toLower(path([tier, 'limit'], TIERS))],
      0
    )
  const tierLimit = limits[path([tier, 'limit'], TIERS)]
  const tierStatus = status(tier, userTiers, path([tier, 'time'], TIERS))
  const isRejected = all(propEq('state', TIERS_STATES.REJECTED), userTiers)

  const tierStarted = path(['tiers', 'selected'], userData) >= tier

  let className = ''
  if (column) className += ' column'
  if (isRejected) className += ' rejected'

  return (
    <Wrapper className={className}>
      {tier === 2 && (
        <Announcement uppercase weight={500} size='18px' color='white'>
          <FormattedMessage
            id='components.identityverification.tiercard.getfreecrypto'
            defaultMessage='Get Free Crypto'
          />
        </Announcement>
      )}
      <Container>
        <Header color='marketing-primary' uppercase>
          <FormattedMessage
            id='components.identityverification.tiercard.tierheader'
            defaultMessage='Tier {tier} Verification'
            values={{ tier }}
          />
        </Header>
        <Content>
          <Row>
            <Column>
              <Text size='32px' color='marketing-secondary'>
                {symbol}
              </Text>
              <Text size='14px' color='textBlack' style={{ marginTop: '8px' }}>
                {tierLimit}
              </Text>
              <Text size='14px' color='gray-3' style={{ marginTop: '7px' }}>
                {tierStatus}
              </Text>
            </Column>
            <Column>
              {path([tier, 'requirements'], TIERS).map((requirement, i) => (
                <TextGroup inline key={i} style={{ marginBottom: '8px' }}>
                  {messages[requirement.name]}
                  {requirement.complete({
                    userData,
                    userTiers,
                    mobileVerified,
                    emailVerified
                  }) && (
                    <Icon
                      style={{ marginLeft: '5px' }}
                      color='success'
                      size='12px'
                      name='check'
                    />
                  )}
                </TextGroup>
              ))}
            </Column>
          </Row>
        </Content>
        {tierData.state === TIERS_STATES.NONE && (
          <ActionButton
            jumbo
            fullwidth
            nature='primary'
            onClick={verifyIdentity}
          >
            {tierStarted ? (
              <FormattedMessage
                id='components.identityverification.tiercard.continue'
                defaultMessage='Continue'
              />
            ) : (
              <FormattedMessage
                id='components.identityverification.tiercard.getstarted'
                defaultMessage='Get Started'
              />
            )}
          </ActionButton>
        )}
        {tierData.state === TIERS_STATES.VERIFIED && (
          <ActionButton jumbo fullwidth nature='primary' onClick={goToSwap}>
            <FormattedMessage
              id='components.identityverification.tiercard.swap_now'
              defaultMessage='Swap Now'
            />
          </ActionButton>
        )}
      </Container>
    </Wrapper>
  )
}

TierCard.defaultProps = {
  outsideOfProfile: false
}

const mapDispatchToProps = (dispatch, { tier }) => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(tier)),
  goToSwap: () => dispatch(actions.router.push('/swap'))
})

export default connect(
  getData,
  mapDispatchToProps
)(TierCard)
