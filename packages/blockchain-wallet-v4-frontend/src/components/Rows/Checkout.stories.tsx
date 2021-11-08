import React from 'react'

import CheckoutRow from './Checkout'

export default {
  component: CheckoutRow,
  title: 'Rows/CheckoutRow'
}

export const Default = (args) => <CheckoutRow {...args} title='Title Text' text='Text Value' />

export const WithAdditionalText = (args) => (
  <CheckoutRow {...args} additionalText='Some other text' text='One Time' title='Frequency' />
)
export const WithToolTip = (args) => (
  <CheckoutRow
    {...args}
    toolTip='foooooooooo'
    additionalText='Some other text'
    text='One Time'
    title='Frequency'
  />
)
export const ToolTipNoAdditional = (args) => (
  <CheckoutRow {...args} toolTip='foooooooooo' text='One Time' title='Frequency' />
)

export const SubTitleNoValue = (args) => (
  <CheckoutRow {...args} subTitle='Sub title text' title='Frequency' />
)

export const SubTitleToolTip = (args) => (
  <CheckoutRow
    {...args}
    toolTip='Newly added funds are subject to a holding period. You can transfer between your Trading, Rewards, and Exchange accounts in the meantime.'
    subTitle='$30,0000 Available'
    title='Daily Limit'
  />
)
