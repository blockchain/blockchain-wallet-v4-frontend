import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Trade, OrderHistoryHeader } from '../../src'

let date = new Date()

let trades = [
  {
    state: 'pending',
    date: date.toDateString(),
    depositAmount: '1 BTC',
    withdrawalAmount: '10 ETH',
    quote: {
      orderId: '123'
    }
  },
  {
    state: 'complete',
    date: date.toDateString(),
    depositAmount: '.5 BTC',
    withdrawalAmount: '6 ETH',
    quote: {
      orderId: '123456'
    }
  },
  {
    state: 'failed',
    date: date.toDateString(),
    depositAmount: '.05 BTC',
    withdrawalAmount: '1 ETH',
    quote: {
      orderId: '123456789'
    }
  }
]

let openDetails = (trade) => console.log('open trade details', trade)

storiesOf('Trade', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('ShapeShift Trades', () =>
    <div>
      <OrderHistoryHeader sent='Exchanged' received='Received' />
      {
        trades.map(t => {
          return <Trade trade={t} key={t.quote.orderId} openTradeDetails={() => openDetails(t)} />
        })
      }
    </div>
  )
