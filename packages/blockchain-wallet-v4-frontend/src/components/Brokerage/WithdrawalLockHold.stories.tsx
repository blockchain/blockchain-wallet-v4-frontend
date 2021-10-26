import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import WithdrawalLockHold from './WithdrawalLockHold'

export default {
  component: WithdrawalLockHold,
  decorators: [
    (Story) => {
      return <IntlProvider locale='en'>{Story()}</IntlProvider>
    }
  ],
  title: 'Flyouts/Brokerage/WithdrawalLockHold'
} as ComponentMeta<typeof WithdrawalLockHold>

const Template: ComponentStory<typeof WithdrawalLockHold> = (args) => (
  <WithdrawalLockHold {...args} />
)

export const Flyout = Template.bind({})
Flyout.args = {
  amount: '5000',
  currency: 'USD',
  handleClick: () => {},
  mode: 'flyout'
}

export const Tooltip = Template.bind({})
Tooltip.args = {
  amount: '5000',
  currency: 'USD',
  mode: 'tooltip'
}
