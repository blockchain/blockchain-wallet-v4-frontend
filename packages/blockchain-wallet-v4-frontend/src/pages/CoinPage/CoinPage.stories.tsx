import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CoinPage, CoinPageComponent } from '.'

const coinPageStory: ComponentMeta<CoinPageComponent> = {
  component: CoinPage,
  title: 'Pages/CoinPage'
}

const Template: ComponentStory<CoinPageComponent> = (args) => <CoinPage {...args} />

export const Default = Template.bind({})
Default.args = {}

export default coinPageStory
