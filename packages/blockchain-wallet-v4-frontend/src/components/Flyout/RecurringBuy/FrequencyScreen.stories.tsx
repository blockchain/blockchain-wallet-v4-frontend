import React from 'react'
import { IntlProvider } from 'react-intl'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SBPaymentTypes } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'

import FrequencyScreen from './FrequencyScreen'

export default {
  argTypes: {
    method: { options: Object.values(SBPaymentTypes) }
  },
  args: {
    headerMode: 'back',
    method: SBPaymentTypes.BANK_TRANSFER,
    paymentInfo: [
      {
        eligibleMethods: ['FUNDS'],
        nextPayment: '2021-08-20T22:26:52.494Z',
        period: 'DAILY'
      },
      {
        eligibleMethods: ['FUNDS', 'BANK_TRANSFER'],
        nextPayment: '2021-08-26T22:26:52.494Z',
        period: 'WEEKLY'
      },
      {
        eligibleMethods: ['FUNDS', 'BANK_TRANSFER'],
        nextPayment: '2021-09-02T22:26:52.494Z',
        period: 'BI_WEEKLY'
      },
      {
        eligibleMethods: ['FUNDS', 'BANK_TRANSFER'],
        nextPayment: '2021-09-19T22:26:52.494Z',
        period: 'MONTHLY'
      }
    ]
  },
  component: FrequencyScreen,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <Story />
      </IntlProvider>
    )
  ],
  title: 'Flyouts/RecurringBuy/FrequencySelection'
} as ComponentMeta<typeof FrequencyScreen>

export const Default: ComponentStory<typeof FrequencyScreen> = (args) => (
  <FrequencyScreen
    {...args}
    headerAction={action('header action button clicked')}
    setPeriod={(period) => {
      return action(`${period} option clicked`)
    }}
  />
)
