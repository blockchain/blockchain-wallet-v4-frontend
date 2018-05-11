import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Button, Image, Text } from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:after {
    border-left: 0 !important;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 200px;
`

const Empty = props => (
  <Wrapper>
    <Container>
      <Image name='blue-logo' width='40px' height='40px' />
      <Text size='16px' weight={300}>
        <FormattedMessage id='scenes.home.activitylist.empty.notx' defaultMessage='No transactions yet? No problem.' />
      </Text>
      <Text size='16px' weight={300}>
        <FormattedMessage id='scenes.home.activitylist.empty.funds' defaultMessage='Get started by adding some funds to your wallet!' />
      </Text>
      {
        props.partner ? <LinkContainer to='/buy-sell'>
          <Button uppercase rounded nature='primary'>
            <FormattedMessage id='scenes.home.activitylist.empty.buybitcoin' defaultMessage='Buy Bitcoin' />
          </Button>
        </LinkContainer> : <Button uppercase rounded nature='primary' onClick={props.handleRequest}>
          <FormattedMessage id='scenes.home.activitylist.empty.requestfunds' defaultMessage='Request Funds' />
        </Button>
      }
    </Container>
  </Wrapper>
)

export default Empty
