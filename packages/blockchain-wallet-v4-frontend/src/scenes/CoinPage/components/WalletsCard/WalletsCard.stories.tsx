import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { StandardRow } from 'components/Rows'
import * as StandardRowStory from 'components/Rows/StandardRow.stories'

import { WalletsCard, WalletsCardComponent } from '.'

const walletsCardStoriesMeta: ComponentMeta<WalletsCardComponent> = {
  argTypes: {
    actions: {
      defaultValue: ''
    },
    coinCode: {
      defaultValue: 'BTC'
    },
    coinTotal: {
      defaultValue: '0.0'
    },
    total: {
      defaultValue: '$0.00'
    }
  },
  component: WalletsCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/WalletsCard'
}

// @ts-ignore
const Template: ComponentStory<WalletsCardComponent> = (args) => <WalletsCard {...args} />

export const Default = Template.bind({})
Default.args = {
  // @ts-ignore
  children: [1, 2, 3].map((num) => <StandardRow key={num} {...StandardRowStory.Default.args} />)
}

export const Loading = Template.bind({})
Loading.args = {
  // @ts-ignore
  children: [1, 2, 3].map((num) => <StandardRow key={num} {...StandardRowStory.Loading.args} />)
}

export default walletsCardStoriesMeta
