import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import BuyMoreLine from './BuyMoreLine'

const store = createStore(combineReducers({}))

export default {
  args: {
    buyAmount: '333 ETH',
    close: () => {},
    coin: 'ETH',
    startBuy: () => {}
  },
  component: BuyMoreLine,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Flyouts/Banners/BuyMoreLine'
} as ComponentMeta<typeof BuyMoreLine>

export const Template: ComponentStory<typeof BuyMoreLine> = (args) => <BuyMoreLine {...args} />

export const Default = Template.bind({})
