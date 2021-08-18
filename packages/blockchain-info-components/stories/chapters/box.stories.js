import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Box } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Box',
  component: Box,
  decorators: [(story) => <Layout>{story()}</Layout>],
  argTypes: {
    disabled: { 
        control: 'boolean',
        description: 'disabled box',
        defaultValue: false
    },
    isMethod: {
        control: 'boolean',
        description: 'displayed as a payment method or placeholder text in order to vertically center children',
        defaultValue: false
    },
    isMobile: {
        control: 'boolean',
        description: 'is on mobile',
        defaultValue: false
    }
  }
}

export const BrokerageBox = (args) => <Box {...args}>Brokerage Box</Box>

BrokerageBox.storyName = 'Brokerage Box'