import React from 'react'
import { IntlProvider } from 'react-intl'

import { RecurringBuyRegisteredList } from '../../../data/types'
import RemoveConfirm from './RemoveConfirm'

export default {
  args: {
    activeDetails: {
      id: '1234'
    } as RecurringBuyRegisteredList,
    close: () => {},
    goBack: () => {},
    removeClick: () => {}
  },
  component: RemoveConfirm,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh' }}>{Story()}</div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/RecurringBuy/RecurringBuyRemoveConfirm'
}

export const Default = (args) => <RemoveConfirm {...args} />
