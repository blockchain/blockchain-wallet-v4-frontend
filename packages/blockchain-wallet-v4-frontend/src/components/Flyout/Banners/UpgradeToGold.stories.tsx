import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import UpgradeToGold from './UpgradeToGold'

const store = createStore(combineReducers({}))

export default {
  args: {
    close: () => {},
    limits: {
      currency: 'GBP',
      current: {
        available: {
          currency: 'GBP',
          value: '200000'
        },
        daily: {
          effective: true,
          limit: {
            currency: 'GBP',
            value: '200000'
          }
        }
      },
      suggestedUpgrade: {
        available: {
          currency: 'GBP',
          value: '20000000'
        },
        daily: {
          available: {
            currency: 'GBP',
            value: '20000000'
          },
          limit: {
            currency: 'GBP',
            value: '20000000'
          },
          used: {
            currency: 'GBP',
            value: '0'
          }
        },
        requiredTier: 2,
        requirements: ['KYC']
      }
    },
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
  title: 'Flyouts/Banners/UpgradeToGold'
} as ComponentMeta<typeof UpgradeToGold>

export const Template: ComponentStory<typeof UpgradeToGold> = (args) => <UpgradeToGold {...args} />

export const Default = Template.bind({})
