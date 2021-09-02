import React from 'react'

import SubHeader from './SubHeader'

export default {
  args: {
    'data-e2e': 'foooo',
    subTitle: '$100',
    title: '10.0000 BTC'
  },
  component: SubHeader,
  title: 'Flyouts/SubHeader'
}

export const Default = (args) => <SubHeader {...args} />
