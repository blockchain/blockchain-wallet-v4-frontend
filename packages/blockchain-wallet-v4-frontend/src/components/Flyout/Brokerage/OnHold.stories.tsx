import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { WithdrawalLock } from '@core/types'

import OnHold from './OnHold'

export default {
  component: OnHold,
  decorators: [
    (Story) => {
      return (
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
          </div>
        </IntlProvider>
      )
    }
  ],
  title: 'Flyouts/Brokerage/OnHold'
} as ComponentMeta<typeof OnHold>

const Template: ComponentStory<typeof OnHold> = (args) => <OnHold {...args} />

export const Default = Template.bind({})
Default.args = {
  fiatCurrency: 'USD',
  handleHeaderClick: () => {},
  locks: [
    {
      amount: {
        amount: '5000',
        currency: 'USD'
      },
      expiresAt: '2021-11-26T15:30:13.212Z'
    } as unknown as WithdrawalLock,
    {
      amount: {
        amount: '500',
        currency: 'USD'
      },
      expiresAt: '2031-07-26T15:30:13.212Z'
    } as unknown as WithdrawalLock
  ],
  totalLockedAmount: '2000'
}
