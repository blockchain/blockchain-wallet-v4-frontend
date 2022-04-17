import React from 'react'
import { IntlProvider } from 'react-intl'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RecurringBuyPeriods } from 'data/types'

import { RecurringBuyListItem, RecurringBuyListItemComponent } from '.'

const recurringBuyListItemStoriesMeta: ComponentMeta<RecurringBuyListItemComponent> = {
  argTypes: {
    date: {
      control: {
        type: 'date'
      }
    }
  },
  component: RecurringBuyListItem,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/RecurringBuyListItem'
}

const Template: ComponentStory<RecurringBuyListItemComponent> = (args) => {
  const onClickAction = action('onClick')

  return <RecurringBuyListItem {...args} onClick={onClickAction} />
}

export const NextBuyToday = Template.bind({})
NextBuyToday.args = {
  currency: 'USD',
  date: new Date(),
  period: RecurringBuyPeriods.MONTHLY,
  value: 1000
}

const now = new Date()

const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

export const NextBuyTomorrow = Template.bind({})
NextBuyTomorrow.args = {
  currency: 'USD',
  date: tomorrow,
  period: RecurringBuyPeriods.MONTHLY,
  value: 1000
}

export const MonthlyBuy = Template.bind({})
MonthlyBuy.args = {
  currency: 'USD',
  date: new Date(),
  period: RecurringBuyPeriods.MONTHLY,
  value: 1000
}

export const DailyBuy = Template.bind({})
DailyBuy.args = {
  currency: 'USD',
  date: new Date(),
  period: RecurringBuyPeriods.DAILY,
  value: 1000
}

export const BiWeeklyBuy = Template.bind({})
BiWeeklyBuy.args = {
  currency: 'USD',
  date: new Date(),
  period: RecurringBuyPeriods.BI_WEEKLY,
  value: 1000
}

export const WeeklyBuy = Template.bind({})
WeeklyBuy.args = {
  currency: 'USD',
  date: new Date(),
  period: RecurringBuyPeriods.WEEKLY,
  value: 1000
}

export default recurringBuyListItemStoriesMeta
