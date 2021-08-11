import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions'

import { FlyoutHeader } from '../../src'
import { Props } from '../../src/Flyouts/Header'

export default {
  title: 'Flyouts/Header',
  component: FlyoutHeader,
  args: {
    'data-e2e': 'foooo',
    mode: 'back'
  },
  argTypes: {
    mode: {
      type: 'select',
      options: ['close', 'back']
    }
  }
} as Meta

export const BackArrowHeader: Story<Props> = (args) => <FlyoutHeader {...args} onClick={action('back arrow clicked')}>Buy Bitcoin</FlyoutHeader>

export const CloseOnlyHeader: Story<Props> = (args) => <FlyoutHeader {...args} mode='close' onClick={action('close button clicked')}/>
