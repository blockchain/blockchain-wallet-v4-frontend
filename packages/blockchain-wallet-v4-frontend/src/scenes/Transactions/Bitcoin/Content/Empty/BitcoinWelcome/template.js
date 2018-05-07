import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Icon, Image, Link, Separator, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: ${props => props.displayed ? 'flex' : 'none'};
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  background-color: ${props => props.theme['brand-quaternary']};
`
const BitcoinImage = styled(Image)`
  display: none;
  height: 230px;
  opacity: 0.3;
  color: ${props => props.theme['brand-tertiary']};
  @media(min-width: 1200px) { display: block; }
`
const Container = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  @media(min-width: 1200px) {
    flex-direction: row;
  }
`
const Cell = styled.div`
  width: 100%;
  padding: 15px 0 15px 15px;
  box-sizing: border-box;
  @media(min-width: 768px) { ${props => props.small ? '30%' : '35%'}; }

`
const CloseArrow = styled(Icon)`
  height: 30px;
  width: 30px;
  margin-top: 20px;
`
const BitcoinWelcome = props => {
  const { displayed, handleClick } = props

  return (
    <Wrapper displayed={displayed}>
      <BitcoinImage name='half-bitcoin' />
      <Container>
        <Row>
          <Cell small>
            <Text size='24px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.welcome' defaultMessage='Welcome to Bitcoin' />
            </Text>
            <Link href='https://blockchain.info/wallet/bitcoin-faq' size='16px' target='_blank' weight={300} uppercase>
              <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.learnmore' defaultMessage='Learn More' />
              <Icon name='right-arrow' color='brand-secondary' />
            </Link>
          </Cell>
          <Cell>
            <Text weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.what' defaultMessage='What is bitcoin?' />
            </Text>
            <Separator />
            <TextGroup inline>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.currency' defaultMessage='Bitcoin is a digital currency, and is used like other assets in exchange for goods and services.' />
              </Text>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.transact' defaultMessage='Unlike traditional currencies and assets, bitcoin is easily portable, divisible, and irreversible.' />
              </Text>
            </TextGroup>
          </Cell>
          <Cell>
            <Text weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.why' defaultMessage='Why should I use it?' />
            </Text>
            <Separator />
            <TextGroup inline>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.fees' defaultMessage='As a global currency you can send bitcoin to anyone, anywhere in the world without worrying about cross border remittance fees.' />
              </Text>
            </TextGroup>
          </Cell>
        </Row>
        <Row>
          <LinkContainer to='/buy-sell'>
            <Button nature='primary' margin='20px' fullwidth uppercase>
              <FormattedMessage id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.getstarted' defaultMessage='Get started with bitcoin' />
            </Button>
          </LinkContainer>
        </Row>
      </Container>
      <CloseArrow name='close' size='12px' cursor onClick={handleClick} />
    </Wrapper>
  )
}

BitcoinWelcome.propTypes = {
  displayed: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default BitcoinWelcome
