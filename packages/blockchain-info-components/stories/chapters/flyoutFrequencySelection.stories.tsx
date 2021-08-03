import React from 'react'
import { action } from '@storybook/addon-actions'

import {
  FrequencyScreen
} from '../../src'

export default {
  title: 'Flyouts/FrequencySelection',
  component: FrequencyScreen,
  args: {
    headerMode: 'back'
  }
}

export const Default = (args) => (
  <FrequencyScreen
    {...args}
    headerAction={action('header action button clicked')}
    setPeriod={(period) => {return action(`${period} option clicked`)}}
  />
)