import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Toast } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Toast',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout height='600px'>{story()}</Layout>]
}

export const Default = () => (
  <Toast>
    <span>Alert</span>
    <span>This is what a default toast looks like on desktop.</span>
  </Toast>
)

export const Error = () => (
  <Toast nature='error'>
    <span>Error</span>
    <span>This is what an error toast looks like on desktop.</span>
  </Toast>
)

export const Success = () => (
  <Toast nature='success'>
    <span>Success</span>
    <span>This is what a success toast looks like on desktop.</span>
  </Toast>
)
