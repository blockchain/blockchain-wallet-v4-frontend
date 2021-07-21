import React from 'react'

import { AmountSubHeader } from '../../src'

export default {
  title: 'Flyouts/AmountSubHeader',
  component: AmountSubHeader,
  args: {
    'data-e2e': 'foooo',
    title: '10.0000 BTC',
    subTitle: '$100'
  },
}

export const Default = (args) => <AmountSubHeader {...args} />
