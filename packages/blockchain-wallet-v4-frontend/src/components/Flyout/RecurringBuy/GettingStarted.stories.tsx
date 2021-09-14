import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import GettingStarted from './GettingStarted'

export default {
  args: {
    amount: '$20',
    close: () => {},
    nextStep: () => {},
    outputCurrency: 'BTC'
  },
  component: GettingStarted,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh' }}>
          <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
        </div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/RecurringBuy/GettingStarted'
} as ComponentMeta<typeof GettingStarted>

export const Default: ComponentStory<typeof GettingStarted> = (args) => <GettingStarted {...args} />
