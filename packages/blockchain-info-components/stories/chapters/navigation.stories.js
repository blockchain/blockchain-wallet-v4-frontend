import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import Navigation from '../../src/Navigation'

addDecorator(withInfo)

export default {
  title: 'Navigation',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Navigation = () => <Navigation />
