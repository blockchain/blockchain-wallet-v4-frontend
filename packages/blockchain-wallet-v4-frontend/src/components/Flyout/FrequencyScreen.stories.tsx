import React from 'react'
import { IntlProvider } from 'react-intl'
import { action } from '@storybook/addon-actions'

import FrequencyScreen from './FrequencyScreen'

export default {
  args: {
    headerMode: 'back'
  },
  component: FrequencyScreen,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <Story />
      </IntlProvider>
    )
  ],
  title: 'Flyouts/FrequencySelection'
}

export const Default = (args) => (
  <FrequencyScreen
    {...args}
    headerAction={action('header action button clicked')}
    setPeriod={(period) => {
      return action(`${period} option clicked`)
    }}
  />
)
