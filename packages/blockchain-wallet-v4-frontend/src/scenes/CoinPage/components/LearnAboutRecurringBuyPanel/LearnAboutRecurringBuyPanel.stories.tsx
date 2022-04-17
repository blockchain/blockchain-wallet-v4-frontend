import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { LearnAboutRecurringBuyPanel } from './LearnAboutRecurringBuyPanel'
import { LearnAboutRecurringBuyPanelComponent } from './types'

const learnAboutRecurringBuyPanelStoriesMeta: ComponentMeta<LearnAboutRecurringBuyPanelComponent> =
  {
    component: LearnAboutRecurringBuyPanel,
    decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
    title: 'Pages/CoinPage/LearnAboutRecurringBuyPanel'
  }

const Template: ComponentStory<LearnAboutRecurringBuyPanelComponent> = (args) => (
  <LearnAboutRecurringBuyPanel {...args} />
)

export const Default = Template.bind({})

export default learnAboutRecurringBuyPanelStoriesMeta
