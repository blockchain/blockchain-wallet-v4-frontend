import React from 'react'
import { IntlProvider } from 'react-intl'

import { ActionEnum, RecurringBuyPeriods } from '../../data/types'
import SavedRecurringBuy from './SavedRecurringBuy'

const date = new Date()

export default {
  argTypes: {
    action: {
      options: [...Object.values(ActionEnum)],
      type: 'select'
    },
    period: {
      options: [...Object.values(RecurringBuyPeriods)],
      type: 'select'
    }
  },
  args: {
    action: 'BUY',
    amount: '$20',
    coin: 'BTC',
    nextPayment: new Date(date.setDate(date.getDate() + 1)),
    onClick: () => {},
    period: 'DAILY'
  },
  component: SavedRecurringBuy,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <Story />
      </IntlProvider>
    )
  ],
  title: 'RecurringBuy/Registered'
}

export const Default = (args) => <SavedRecurringBuy {...args} />
export const Today = (args) => <SavedRecurringBuy {...args} nextPayment={new Date()} />
