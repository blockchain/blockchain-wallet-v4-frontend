import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { OrderHistoryHeader } from '../../src'

storiesOf('Order History Header', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('For Exchange', () =>
    <OrderHistoryHeader sent='Exchanged' received='Received' />
  )
  .add('For Buy/Sell', () =>
    <OrderHistoryHeader sent='BTC' received='Total' />
  )
