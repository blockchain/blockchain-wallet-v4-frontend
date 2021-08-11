import React from 'react'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react/types-6-0'

import Header, { Props } from './Header'

export default {
  argTypes: {
    mode: {
      options: ['close', 'back'],
      type: 'select'
    }
  },
  args: {
    'data-e2e': 'foooo',
    mode: 'back'
  },
  component: Header,
  title: 'Flyouts/Header'
} as Meta

export const BackArrowHeader: Story<Props> = (args) => (
  <Header {...args} onClick={action('back arrow clicked')}>
    Buy Bitcoin
  </Header>
)

export const CloseOnlyHeader: Story<Props> = (args) => (
  <Header {...args} mode='close' onClick={action('close button clicked')} />
)
