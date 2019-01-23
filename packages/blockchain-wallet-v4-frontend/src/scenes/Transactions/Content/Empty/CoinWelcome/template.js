import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import { lighten } from 'polished'

import { model } from 'data'
import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { coinProps } from './model'

const Wrapper = styled.div`
  padding-top: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 0 auto 25px;
  width: 640px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid ${props => props.theme['brand-quaternary']};
  ${media.mobile`
    flex-direction: column;
    width: 100%;
  `};
`
const Row = styled.div`
  width: 50%;
  padding: 25px;
  ${media.mobile`
    width: 100%;
    box-sizing: border-box;
  `};
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
  line-height: 1.4;
`
const CoinRow = styled.div`
  width: 50%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: ${props => lighten(0.4, props.theme[props.coin])};
  ${media.mobile`
    width: 100%;
  `};
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  > button:first-child {
    margin-right: 15px;
  }
`
const LearnMoreContainer = styled(Link)`
  width: 640px;
  display: flex;
  justify-content: space-between;
  margin: 0px auto 25px;
  padding: 25px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
`
const LearnMoreText = styled(Text)`
  margin-right: 15px;
  color: ${props => props.theme['brand-secondary']};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`

const Welcome = props => {
  const { availability, coin, handleRequest, partner } = props

  return (
    <Wrapper>
      <Container>
        <Row>
          <Text size='24px' weight={400} color='brand-primary'>
            <FormattedMessage
              id='scenes.transaction.content.empty.yourcoinwallet'
              defaultMessage='Your {coin} Wallet'
              values={{ coin }}
            />
          </Text>
          <Content weight={300}>
            <FormattedMessage
              id='scenes.transaction.content.empty.sendreqswap'
              defaultMessage='Send, Request and Swap {coinName} ({coin}) directly from your Blockchain Wallet.'
              values={{ coinName: coinProps[coin].name, coin }}
            />
          </Content>
          <ButtonContainer>
            {partner ? (
              <LinkContainer to='/buy-sell'>
                <Button
                  nature='primary'
                  fullwidth
                  disabled={!availability.exchange}
                >
                  <FormattedMessage
                    id='scenes.transaction.content.empty.buy'
                    defaultMessage='Buy {coin}'
                    values={{ coin }}
                  />
                </Button>
              </LinkContainer>
            ) : (
              <Button
                nature='primary'
                onClick={handleRequest}
                fullwidth
                disabled={!availability.request}
              >
                <FormattedMessage
                  id='scenes.transaction.content.empty.getstarted.request'
                  defaultMessage='Get {coin}'
                  values={{ coin }}
                />
              </Button>
            )}
            <LinkContainer
              to={{
                pathname: '/swap',
                state: {
                  from: coin === 'BTC' ? 'ETH' : 'BTC',
                  to: coin,
                  amount: '0',
                  fix: model.rates.FIX_TYPES.BASE_IN_FIAT
                }
              }}
            >
              <Button
                nature='empty-secondary'
                fullwidth
                disabled={!availability.exchange}
              >
                <FormattedMessage
                  id='scenes.transaction.content.empty.getstarted.swap'
                  defaultMessage='Swap {coin}'
                  values={{ coin }}
                />
              </Button>
            </LinkContainer>
          </ButtonContainer>
        </Row>
        <CoinRow coin={coin.toLowerCase()}>
          <Icon
            name={coinProps[coin].icon}
            color={coin.toLowerCase()}
            size='160px'
          />
        </CoinRow>
      </Container>
      {coinProps[coin].link && (
        <LearnMoreContainer href={coinProps[coin].link} target='_blank'>
          <Text size='15px'>
            <FormattedMessage
              id='scenes.transaction.content.empty.getstarted.explanation'
              defaultMessage="We've put together a page explaining all of this."
            />
          </Text>
          <LearnMoreLink>
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='scenes.transaction.content.empty.getstarted.learnmore'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
            <Icon
              name='short-right-arrow'
              color='brand-secondary'
              size='18px'
            />
          </LearnMoreLink>
        </LearnMoreContainer>
      )}
    </Wrapper>
  )
}

Welcome.propTypes = {
  availability: PropTypes.object.isRequired,
  coin: PropTypes.string.isRequired,
  partner: PropTypes.string.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Welcome
