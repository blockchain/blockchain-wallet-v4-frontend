import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { defaultHoldingsCardActions } from '../../mocks/defaultHoldingsCardActions'
import { HoldingsCard, HoldingsCardComponent } from '.'

const holdingsCardStoriesMeta: ComponentMeta<HoldingsCardComponent> = {
  argTypes: {
    actions: {
      defaultValue: defaultHoldingsCardActions
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
  component: HoldingsCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/HoldingsCard'
}

export const Template: ComponentStory<HoldingsCardComponent> = (args) => <HoldingsCard {...args} />

export const Bitcoin = Template.bind({})
Bitcoin.args = {
  coinCode: 'BTC',
  coinTotal: '0.00039387',
  total: '$7,926.43'
}

export const BitcoinEmpty = Template.bind({})
BitcoinEmpty.args = {
  coinCode: 'BTC',
  coinTotal: '0',
  total: '0'
}

export default holdingsCardStoriesMeta
