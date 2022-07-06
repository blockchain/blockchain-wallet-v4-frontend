import React from 'react'
import { IntlProvider } from 'react-intl'
import { MemoryRouter } from 'react-router-dom'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RewardsTransactionsCard, RewardsTransactionsCardComponent } from '.'

export default {
  component: RewardsTransactionsCard,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <IntlProvider locale='en'>{Story()}</IntlProvider>
      </MemoryRouter>
    )
  ],
  title: 'Pages/CoinPage/RewardsTransactionsCard'
} as ComponentMeta<RewardsTransactionsCardComponent>

const Template: ComponentStory<RewardsTransactionsCardComponent> = (args) => (
  <RewardsTransactionsCard {...args} />
)

export const Default = Template.bind({})
