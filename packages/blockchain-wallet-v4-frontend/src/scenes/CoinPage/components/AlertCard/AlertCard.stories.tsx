import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { AlertCard, AlertCardComponent } from '.'

const alertCardStoriesMeta: ComponentMeta<AlertCardComponent> = {
  argTypes: {
    content: {
      defaultValue: 'Content'
    },
    title: {
      defaultValue: 'Title'
    }
  },
  component: AlertCard,
  title: 'Pages/CoinPage/AlertCard'
}

export const Template: ComponentStory<AlertCardComponent> = (args) => <AlertCard {...args} />

export const NotTradable = Template.bind({})
NotTradable.args = {
  content: 'Add to your watchlist to be notified when Solana is available to trade.',
  title: 'Solana (SOL) is not tradable.'
}

export default alertCardStoriesMeta
