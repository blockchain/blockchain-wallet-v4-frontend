import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import UpgradeToGold from './template'

const store = createStore(combineReducers({}))

export default {
  args: {
    handleClose: () => {},
    verifyIdentity: () => {}
  },
  component: UpgradeToGold,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Flyouts/BuySell/UpgradeToGold'
} as ComponentMeta<typeof UpgradeToGold>

export const Template: ComponentStory<typeof UpgradeToGold> = (args) => <UpgradeToGold {...args} />

export const Default = Template.bind({})
