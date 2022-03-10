import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ChartBalancePanel } from '.'
import { ChartBalancePanelComponent } from './types'

const chartBalancePanelComponentMeta: ComponentMeta<ChartBalancePanelComponent> = {
  component: ChartBalancePanel,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/ChartBalancePanel'
}

const Template: ComponentStory<ChartBalancePanelComponent> = (args) => (
  <ChartBalancePanel {...args} />
)

export const BitcoinUp = Template.bind({})
BitcoinUp.args = {
  coinCode: 'BTC',
  pastHourDelta: 0.3453908,
  pastHourPrice: '$95.23',
  price: '$31,928.19'
}

export const BitcoinDown = Template.bind({})
BitcoinDown.args = {
  coinCode: 'BTC',
  pastHourDelta: -0.34538978979,
  pastHourPrice: '$95.23',
  price: '$31,928.19'
}

export default chartBalancePanelComponentMeta
