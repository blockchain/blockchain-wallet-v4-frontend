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
const EtherImage = styled(Image)`
  display: none;
  height: 230px;
  opacity: 0.3;
  @media(min-width: 1200px) { display: block; }
`
const Container = styled.div`
  display: flex;
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
  button {
    margin-top: 10px;
  }
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
const EtherWelcome = props => {
  const { displayed, handleClick, handleRequest, exchange } = props

  return (
    <Wrapper displayed={displayed}>
      <EtherImage name='half-ether' />
      <Container>
        <Row>
          <Cell small>
            <Text size='24px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.welcome' defaultMessage='Welcome to' />
            </Text>
            <Text size='24px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.welcome2' defaultMessage='Ether' />
            </Text>
            <Link href='https://www.blockchain.com/ether-basics' target='_blank' size='16px' weight={300} uppercase>
              <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.learnmore' defaultMessage='Learn More' />
              <Icon name='right-arrow' color='brand-secondary' />
            </Link>
          </Cell>
          <Cell>
            <Text weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.what' defaultMessage='What is ether?' />
            </Text>
            <Separator />
            <TextGroup inline>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.currency' defaultMessage='Ether is a digital currency.' />
              </Text>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.transact' defaultMessage='Like Bitcoin, it enables people around the world to transact, save, and hedge their way to a better financial future.' />
              </Text>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.platform' defaultMessage='In addition to sending value, ether also powers the Ethereum platform.' />
              </Text>
            </TextGroup>
          </Cell>
          <Cell>
            <Text weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.why' defaultMessage='Why should I use it?' />
            </Text>
            <Separator />
            <TextGroup inline>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.grow' defaultMessage='As the Ethereum platform grows, more intelligent applications will be built on top of it.' />
              </Text>
              <Text size='12px' weight={300}>
                <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.opportunity' defaultMessage="We want to give you the opportunity to start using ether now, so you' ll be ready to use these products in the future." />
              </Text>
            </TextGroup>
          </Cell>
        </Row>
        <Row>
          {
            exchange ? <LinkContainer to='/exchange'>
              <Button nature='primary' fullwidth uppercase>
                <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.getstarted' defaultMessage='Get started with ether' />
              </Button>
            </LinkContainer> : <Button nature='primary' onClick={handleRequest} fullwidth uppercase>
              <FormattedMessage id='scenes.transaction.ether.content.empty.etherwelcome.getstarted' defaultMessage='Get started with ether' />
            </Button>
          }
        </Row>
      </Container>
      <CloseArrow name='close' size='12px' cursor onClick={handleClick} />
    </Wrapper>
  )
}

EtherWelcome.propTypes = {
  displayed: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default EtherWelcome
