import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CoinHeader, CoinHeaderComponent } from '.'

const coinHeaderStory: ComponentMeta<CoinHeaderComponent> = {
  component: CoinHeader,
  title: 'Pages/CoinPage/CoinHeader'
}

const Template: ComponentStory<CoinHeaderComponent> = (args) => <CoinHeader {...args} />

export const Bitcoin = Template.bind({})
Bitcoin.args = {
  coinCode: 'BTC',
  coinDescription: 'The internet’s first and largest crypto currency.',
  coinName: 'Bitcoin'
}

export const Ethereum = Template.bind({})
Ethereum.args = {
  coinCode: 'ETH',
  coinDescription: 'The internet’s first and largest crypto currency.',
  coinName: 'Ethereum'
}

export default coinHeaderStory
