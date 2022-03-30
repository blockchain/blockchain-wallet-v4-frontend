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
  date: new Date(),
  period: RecurringBuyPeriods.MONTHLY
}

const now = new Date()

const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

export const NextBuyTomorrow = Template.bind({})
NextBuyTomorrow.args = {
  date: tomorrow,
  period: RecurringBuyPeriods.MONTHLY
}

export const MonthlyBuy = Template.bind({})
MonthlyBuy.args = {
  date: new Date(),
  period: RecurringBuyPeriods.MONTHLY
}

export const DailyBuy = Template.bind({})
DailyBuy.args = {
  date: new Date(),
  period: RecurringBuyPeriods.DAILY
}

export const BiWeeklyBuy = Template.bind({})
BiWeeklyBuy.args = {
  date: new Date(),
  period: RecurringBuyPeriods.BI_WEEKLY
}

export const WeeklyBuy = Template.bind({})
WeeklyBuy.args = {
  date: new Date(),
  period: RecurringBuyPeriods.WEEKLY
}

export default recurringBuyListItemStoriesMeta
