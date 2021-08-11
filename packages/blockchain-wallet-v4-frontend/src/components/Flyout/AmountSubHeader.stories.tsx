import React from 'react'

import AmountSubHeader from './AmountSubHeader'

export default {
  args: {
    'data-e2e': 'foooo',
    subTitle: '$100',
    title: '10.0000 BTC'
  },
  component: AmountSubHeader,
  title: 'Flyouts/AmountSubHeader'
}

export const Default = (args) => <AmountSubHeader {...args} />
