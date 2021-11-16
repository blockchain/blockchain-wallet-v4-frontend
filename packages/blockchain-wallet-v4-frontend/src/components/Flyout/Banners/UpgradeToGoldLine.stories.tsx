import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import UpgradeToGoldLine from './UpgradeToGoldLine'

const store = createStore(combineReducers({}))

export default {
  argTypes: {
    type: {
      options: ['BUY', 'SWAP', 'SEND'],
      type: 'select'
    }
  },
  args: {
    type: 'SWAP',
    verifyIdentity: () => {}
  },
  component: UpgradeToGoldLine,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Flyouts/Banners/UpgradeToGoldLine'
} as ComponentMeta<typeof UpgradeToGoldLine>

export const Template: ComponentStory<typeof UpgradeToGoldLine> = (args) => (
  <UpgradeToGoldLine {...args} />
)

export const Default = Template.bind({})
