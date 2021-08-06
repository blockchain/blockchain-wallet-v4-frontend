import React from 'react'

import CheckoutRow from './Checkout'

export default {
  args: {
    additionalText: '',
    text: 'One Time',
    title: 'Frequency'
  },
  component: CheckoutRow,
  title: 'Rows/CheckoutRow'
}

export const Default = (args) => <CheckoutRow {...args} />
export const WithAdditionalText = (args) => (
  <CheckoutRow {...args} additionalText='Some other text' />
)
export const WithToolTip = (args) => (
  <CheckoutRow {...args} toolTip='foooooooooo' additionalText='Some other text' />
)
export const ToolTipNoAdditional = (args) => <CheckoutRow {...args} toolTip='foooooooooo' />
