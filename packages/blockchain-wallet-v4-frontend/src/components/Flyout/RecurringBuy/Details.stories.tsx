import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { BSPaymentTypes } from '@core/types'
import { RecurringBuyPeriods } from 'data/types'

import RecurringBuyDetails from './Details'

export default {
  argTypes: {
    paymentMethod: { options: Object.values(BSPaymentTypes) },
    period: { options: Object.values(RecurringBuyPeriods) }
  },
  args: {
    closeClick: () => {},
    complete: false,
    crypto: 'BTC',
    currency: 'USD',
    id: '12344',
    nextPayment: 'Tues, March 18',
    paymentMethod: BSPaymentTypes.FUNDS,
    period: RecurringBuyPeriods.WEEKLY,
    removeClick: () => {},
    standardAmount: '20'
  },
  component: RecurringBuyDetails,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh' }}>{Story()}</div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/RecurringBuy/RecurringBuyDetails'
} as ComponentMeta<typeof RecurringBuyDetails>

export const Template: ComponentStory<typeof RecurringBuyDetails> = (args) => (
  <RecurringBuyDetails {...args} />
)

export const Default = Template.bind({})
