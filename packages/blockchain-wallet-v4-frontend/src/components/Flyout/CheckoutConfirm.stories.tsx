import React from 'react'

import { Button } from 'blockchain-info-components'

import CheckoutRow from '../Rows/Checkout'
import Container from './Container'
import Content from './Content'
import Footer from './Footer'
import Header from './Header'
import SubHeader from './SubHeader'

export default {
  args: {
    'data-e2e': 'foooo',
    subTitle: '$100',
    title: '10.0000 BTC'
  },
  title: 'Flyouts/CheckoutConfirm'
}

export const Default = (args) => (
  <Container>
    <Header data-e2e='foooo' mode='back' onClick={() => {}}>
      Buy Bitcoin
    </Header>
    <Content mode='top'>
      <SubHeader {...args} />
      <CheckoutRow
        title='Exchange Rate'
        text='$30,000 / BTC'
        toolTip={
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        }
      />
      <CheckoutRow
        title='Exchange Rate'
        text='$30,000 / BTC'
        toolTip={
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        }
      />
      <CheckoutRow
        title='Exchange Rate'
        text='$30,000 / BTC'
        toolTip={
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        }
      />
      <CheckoutRow
        title='Exchange Rate'
        text='$30,000 / BTC'
        toolTip={
          <>Blockchain.com provides the best market price we receive and applies a spread.</>
        }
      />
    </Content>
    <Footer>
      <Button data-e2e='fooo' fullwidth nature='primary'>
        Continue
      </Button>
    </Footer>
  </Container>
)
