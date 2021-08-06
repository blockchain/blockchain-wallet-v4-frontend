import React from 'react'
import moment from 'moment'

import { SavedRecurringBuy } from '../../src'
import { RecurringBuyPeriods } from '../../src/Flyouts/types'

import { ActionEnum } from '../../src/Box/SavedRecurringBuy'

export default {
  title: 'RecurringBuy/Registered',
  component: SavedRecurringBuy,
  argTypes: {
    action: {
      type: 'select',
      options: [...Object.values(ActionEnum)]
    },
    period: {
      type: 'select',
      options: [...Object.values(RecurringBuyPeriods)]
    }
  }
}

const Template = (args) => <SavedRecurringBuy {...args} />

const date = new Date()
export const Default = Template.bind({})
Default.args = {
  coin: 'BTC',
  amount: '$20',
  period: 'DAILY',
  nextPayment: new Date(date.setDate(date.getDate() + 1)),
  action: 'BUY',
  onClick: () => {}
}
