import React from 'react'

import Layout from '../components/layout'
import { Box } from '../../src'

export default {
  title: 'Box',
  component: Box,
  argTypes: {
    disabled: {
        control: 'boolean',
        description: 'disabled box',
    },
    isMethod: {
        control: 'boolean',
        description: 'displayed as a payment method or placeholder text in order to vertically center children',
    },
    isMobile: {
        control: 'boolean',
        description: 'is on mobile',
    }
  }
}

const Template = (args) => <Box {...args} />

export const BrokerageBox = Template.bind({})