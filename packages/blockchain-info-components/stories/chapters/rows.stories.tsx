import React from 'react'

import { CheckoutRow } from '../../src'

export default {
  title: 'Rows/CheckoutRow',
  component: CheckoutRow,
  args: {
    title: 'Frequency',
    text: 'One Time',
    additionalText: ''
  },
}

export const Default = (args) => <CheckoutRow {...args} />
export const WithAdditionalText = (args) => <CheckoutRow {...args} additionalText='Some other text' />
export const WithToolTip = (args) => <CheckoutRow {...args} toolTip={'foooooooooo'} additionalText='Some other text' />
export const ToolTipNoAdditional = (args) => <CheckoutRow {...args} toolTip={'foooooooooo'} />
