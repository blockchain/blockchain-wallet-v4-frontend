import React from 'react'
import { IntlProvider } from 'react-intl'

import { SBPaymentTypes } from '../../../../blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { RecurringBuyPeriods } from '../../data/types'
import RecurringBuyDetails from './RecurringBuyDetails'

export default {
  argTypes: {
    paymentMethod: { options: Object.values(SBPaymentTypes) },
    period: { options: Object.values(RecurringBuyPeriods) }
  },
  args: {
    closeClick: () => {},
    complete: false,
    crypto: 'BTC',
    currency: 'USD',
    id: '12344',
    nextPayment: 'Tues, March 18',
    paymentMethod: SBPaymentTypes.FUNDS,
    period: RecurringBuyPeriods.WEEKLY,
    removeClick: () => {},
    standardAmount: '20'
  },
  component: RecurringBuyDetails,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Story />
        </div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/RecurringBuyDetails'
}

export const Default = (args) => <RecurringBuyDetails {...args} />
