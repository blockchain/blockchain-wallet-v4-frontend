import React from 'react'

import { FlyoutHeader } from '../../src'

export default {
  title: 'Flyouts/Header',
  component: FlyoutHeader,
  args: {
    'data-e2e': 'foooo',
    onClick: () => {},
    mode: 'back'
  },
  argTypes: {
    mode: {
      type: 'select',
      options: ['close', 'back']
    }
  }
}

export const BackArrowHeader = (args) => <FlyoutHeader {...args}>Buy Bitcoin</FlyoutHeader>

export const CloseOnlyHeader = (args) => <FlyoutHeader {...args} mode='close' />
