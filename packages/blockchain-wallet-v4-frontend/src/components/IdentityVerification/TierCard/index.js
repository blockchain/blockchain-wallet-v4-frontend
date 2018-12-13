import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { head, path, propEq, toLower } from 'ramda'
import { connect } from 'react-redux'

import { actions } from 'data'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Text, TextGroup, Icon } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

import { TIERS } from './model'
import { messages, limits, status } from './services'

const Wrapper = styled.div`
  display: flex;
  border-radius: 6px;
  position: relative;
  flex-direction: column;
  border: 1px solid ${props => props.theme['gray-1']};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  width: 375px;
  &.column {
    width: 260px;
  }
  ${media.laptop`
    width: 100%;
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
  align-items: center
  letter-spacing: 2px;
  width: 50%;
  ${Wrapper}.column & {
    width: 100%;
    justify-content: flex-center;
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
  border-radius: 6px 6px 0 0;
  justify-content: center;
  align-items: center;
  letter-spacing: 2px;
  height: 50px;
`
const Content = styled.div`
  margin-top: 10px;
`
const ActionButton = styled(Button)`
  margin-top: 20px;
`

export const TierCard = ({ userData, userTiers, tier, ...rest }) => {
  const { verifyIdentity, column } = rest
  const tierData = head(userTiers.filter(propEq('index', tier)))
  return (
    <Wrapper className={column ? 'column' : ''}>
      {tier === 2 && (
        <Announcement uppercase weight={500} size='16px' color='white'>
          <FormattedMessage
            id='components.identityverification.tiercard.getfreecrypto'
            defaultMessage='Get Free Crypto'
          />
        </Announcement>
      )}
      <Container>
        <Header size='16px' weight={400} color='marketing-primary' uppercase>
          <FormattedMessage
            id='components.identityverification.tiercard.tierheader'
            defaultMessage='Tier {tier} Verification'
            values={{ tier }}
          />
        </Header>
        <Content>
          <Row>
            <Column>
              <Text size='28px' color='marketing-secondary'>
                {Exchange.getSymbol(tierData.limits.currency) +
                  Currency.formatFiat(
                    tierData.limits[toLower(path([tier, 'limit'], TIERS))],
                    0
                  )}
              </Text>
              <Text size='14px' color='textBlack' style={{ marginTop: '8px' }}>
                {limits[path([tier, 'limit'], TIERS)]}
              </Text>
              <Text size='14px' color='gray-3' style={{ marginTop: '7px' }}>
                {status(tierData.state, path([tier, 'time'], TIERS))}
              </Text>
            </Column>
            <Column>
              {path([tier, 'requirements'], TIERS).map((requirement, i) => (
                <TextGroup inline key={i} style={{ marginBottom: '8px' }}>
                  {messages[requirement.name]}
                  {requirement.complete(userData, userTiers) && (
                    <Icon
                      style={{ marginLeft: '5px' }}
                      color='success'
                      size='14px'
                      name='check'
                    />
                  )}
                </TextGroup>
              ))}
            </Column>
          </Row>
        </Content>
        {path([tier, 'isActive'], TIERS)(userData) ? (
          <LinkContainer to={'/exchange'}>
            <ActionButton jumbo fullwidth nature='empty-secondary'>
              <FormattedMessage
                id='components.identityverification.tiercard.makeaswap'
                defaultMessage='Make a Swap'
              />
            </ActionButton>
          </LinkContainer>
        ) : (
          tierData.state !== 'pending' && (
            <ActionButton
              jumbo
              fullwidth
              nature='primary'
              onClick={verifyIdentity}
            >
              <FormattedMessage
                id='components.identityverification.tiercard.getstarted'
                defaultMessage='Get Started'
              />
            </ActionButton>
          )
        )}
      </Container>
    </Wrapper>
  )
}

TierCard.defaultProps = {
  outsideOfProfile: false
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  undefined,
  mapDispatchToProps
)(TierCard)
