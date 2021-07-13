import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import Footer from '../../src/Footer'

addDecorator(withInfo)

export default {
  title: 'Footer',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Footer = () => <Footer />
