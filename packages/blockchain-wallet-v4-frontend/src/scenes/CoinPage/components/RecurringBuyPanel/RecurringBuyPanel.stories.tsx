import React from 'react'
import { IntlProvider } from 'react-intl'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RecurringBuyPeriods } from 'data/types'

import { RecurringBuyListItem } from '../RecurringBuyListItem'
import { RecurringBuyPanel, RecurringBuyPanelComponent } from '.'

const recurringBuyPanelStoriesMeta: ComponentMeta<RecurringBuyPanelComponent> = {
  component: RecurringBuyPanel,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/RecurringBuyPanel'
}

const Template: ComponentStory<RecurringBuyPanelComponent> = (args) => (
  <RecurringBuyPanel {...args} />
)

export const Default = Template.bind({})
Default.args = {
  children: [
    <RecurringBuyListItem
      key={1}
      onClick={action('onClick')}
      date={new Date()}
      period={RecurringBuyPeriods.DAILY}
      currency='USD'
      value={10}
    />,
    <RecurringBuyListItem
      key={2}
      onClick={action('onClick')}
      date={new Date()}
      period={RecurringBuyPeriods.MONTHLY}
      currency='USD'
      value={106}
    />,
    <RecurringBuyListItem
      key={3}
      onClick={action('onClick')}
      date={new Date()}
      period={RecurringBuyPeriods.BI_WEEKLY}
      currency='USD'
      value={8}
    />,
    <RecurringBuyListItem
      key={4}
      onClick={action('onClick')}
      date={new Date()}
      period={RecurringBuyPeriods.WEEKLY}
      currency='USD'
      value={5}
    />
  ]
}

export default recurringBuyPanelStoriesMeta
