import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import TransactionsLeft from './TransactionsLeft'

const store = createStore(combineReducers({}))

export default {
  args: {
    current: 0,
    limit: 1
  },
  component: TransactionsLeft,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Flyouts/Banners/TransactionsLeft'
} as ComponentMeta<typeof TransactionsLeft>

export const Template: ComponentStory<typeof TransactionsLeft> = (args) => (
  <TransactionsLeft {...args} />
)

export const Default = Template.bind({})
