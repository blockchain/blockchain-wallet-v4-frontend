import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import Submitted from './index'

const store = createStore(combineReducers({}))

export default {
  args: {
    startBuy: () => {}
  },
  component: Submitted,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Onboarding/Pages/Submitted'
} as ComponentMeta<typeof Submitted>

export const Template: ComponentStory<typeof Submitted> = (args) => <Submitted {...args} />

export const Default = Template.bind({})
