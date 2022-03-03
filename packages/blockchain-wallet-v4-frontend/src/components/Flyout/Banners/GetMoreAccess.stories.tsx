import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import GetMoreAccess from './GetMoreAccess'

const store = createStore(combineReducers({}))

export default {
  args: {
    startBuy: () => {}
  },
  component: GetMoreAccess,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Flyouts/Banners/GetMoreAccess'
} as ComponentMeta<typeof GetMoreAccess>

export const Template: ComponentStory<typeof GetMoreAccess> = (args) => <GetMoreAccess {...args} />

export const Default = Template.bind({})
