import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import { lighten } from 'polished'

import { Button, Icon, Text } from 'blockchain-info-components'

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
  background-color: ${props => lighten(0.4, props.theme['eth'])};
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

const BchWelcome = props => {
  const { displayed, handleRequest } = props

  return (
    <Wrapper displayed={displayed}>
      <Container>
        <Row>
          <Text size='24px' weight={400} color='brand-primary'>
            <FormattedMessage
              id='scenes.transaction.content.empty.ethwelcome.yourethwallet'
              defaultMessage='Your ETH Wallet'
            />
          </Text>
          <Content weight={300}>
            <FormattedMessage
              id='scenes.transaction.content.empty.ethwelcome.sendreqexchange'
              defaultMessage='Send, Request and Exchange Ethereum (ETH) directly from your Blockchain Wallet.'
            />
          </Content>
          <ButtonContainer>
            <Button
              nature='primary'
              onClick={handleRequest}
              fullwidth
              uppercase
            >
              <FormattedMessage
                id='scenes.transaction.eth.content.empty.ethwelcome.getstarted.requesteth'
                defaultMessage='Get ETH'
              />
            </Button>
            <LinkContainer to='/exchange'>
              <Button nature='empty-secondary' fullwidth>
                <FormattedMessage
                  id='scenes.transaction.eth.content.empty.ethwelcome.getstarted.exchange'
                  defaultMessage='Exchange ETH'
                />
              </Button>
            </LinkContainer>
          </ButtonContainer>
        </Row>
        <CoinRow>
          <Icon name='eth-circle' color='eth' size='160px' />
        </CoinRow>
      </Container>
    </Wrapper>
  )
}

BchWelcome.propTypes = {
  displayed: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default BchWelcome
