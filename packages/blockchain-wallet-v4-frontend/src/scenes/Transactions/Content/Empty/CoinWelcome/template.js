import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { model } from 'data'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding-top: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto 25px;
  width: 640px;
  ${media.tablet`
    flex-direction: column;
    width: 100%;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  &:last-child {
    margin-top: 32px;
  }
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
  line-height: 1.4;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`
const FooterButton = styled(Button)`
  height: 56px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
`
const LearnMoreContainer = styled(Link)`
  width: 640px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto 25px;
  padding: 25px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
`
const LearnMoreText = styled(Text)`
  margin-right: 15px;
  color: ${props => props.theme.blue600};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`

const getContent = currentCoin => {
  switch (currentCoin.coinCode) {
    case 'XLM': {
      return (
        <Content weight={400}>
          <FormattedMessage
            id='scenes.transaction.content.empty.xlm.subtitle2'
            defaultMessage='XLM is a token that enables quick, low cost global transactions. Send, receive, and trade XLM from your Wallet today.'
          />
        </Content>
      )
    }
    default: {
      return (
        <Content weight={400}>
          <FormattedMessage
            id='scenes.transaction.content.empty.newcoinswap'
            defaultMessage='Send, Request and Swap {coinName} ({coinCode}) directly from your Blockchain Wallet.'
            values={{
              coinName: currentCoin.displayName,
              coinCode: currentCoin.coinTicker
            }}
          />
        </Content>
      )
    }
  }
}

const Welcome = props => {
  const { availability, currentCoin, handleRequest, partner } = props

  return (
    <Wrapper>
      <Container>
        <Row>
          <Column>
            <div>
              <Text size='24px' weight={500} color='blue900'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.newcoinwallet'
                  defaultMessage='Your {coin} Wallet'
                  values={{ coin: currentCoin.coinTicker }}
                />
              </Text>
              {getContent(currentCoin)}
            </div>
          </Column>
          <Column>
            <Icon
              name={currentCoin.icons.circleFilled}
              color={currentCoin.colorCode}
              size='112px'
            />
          </Column>
        </Row>
        <Row>
          <Column style={{ paddingRight: '20px' }}>
            {partner ? (
              <LinkContainer to='/buy-sell'>
                <FooterButton
                  nature='primary'
                  fullwidth
                  disabled={!availability.exchange}
                >
                  <FormattedMessage
                    id='scenes.transaction.content.empty.newcoinbuy'
                    defaultMessage='Buy {coin}'
                    values={{ coin: currentCoin.coinTicker }}
                  />
                </FooterButton>
              </LinkContainer>
            ) : (
              <FooterButton
                nature='primary'
                onClick={handleRequest}
                fullwidth
                disabled={!availability.request}
              >
                <FormattedMessage
                  id='scenes.transaction.content.empty.getstarted.newcoinrequest'
                  defaultMessage='Get {coin}'
                  values={{ coin: currentCoin.coinTicker }}
                />
              </FooterButton>
            )}
          </Column>
          <Column style={{ paddingLeft: '20px' }}>
            <LinkContainer
              to={{
                pathname: '/swap',
                state: {
                  from: currentCoin.coinTicker === 'BTC' ? 'ETH' : 'BTC',
                  to: currentCoin.coinTicker,
                  amount: '0',
                  fix: model.rates.FIX_TYPES.BASE_IN_FIAT
                }
              }}
            >
              <FooterButton
                nature='empty-secondary'
                fullwidth
                disabled={!availability.exchange}
              >
                <FormattedMessage
                  id='scenes.transaction.content.empty.getstarted.newcoinswap'
                  defaultMessage='Swap {coin}'
                  values={{ coin: currentCoin.coinTicker }}
                />
              </FooterButton>
            </LinkContainer>
          </Column>
        </Row>
        <Row>
          <Column>
            {currentCoin.learnMoreLink && (
              <LearnMoreContainer
                href={currentCoin.learnMoreLink}
                target='_blank'
              >
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
                  <Icon name='arrow-right' color='blue600' size='18px' />
                </LearnMoreLink>
              </LearnMoreContainer>
            )}
          </Column>
        </Row>
      </Container>
    </Wrapper>
  )
}

Welcome.propTypes = {
  availability: PropTypes.object.isRequired,
  currentCoin: PropTypes.object.isRequired,
  partner: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Welcome
