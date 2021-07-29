import React from 'react'

import { AmountSubHeader } from '../../src'

export default {
  title: 'Flyouts/AmountSubHeader',
  component: AmountSubHeader,
}

const Template = (args) => <AmountSubHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  'data-e2e': 'foooo',
  title: '10.0000 BTC',
  subTitle: '$100'
}
