import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import { Link } from '../../src'
import Layout from '../components/layout'

addDecorator(withInfo)

export default {
  title: 'Links',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Link = () => <Link>This is a link</Link>
export const BoldLink = () => <Link weight={900}>This is a bold link</Link>
export const UppercaseLink = () => <Link uppercase>This is an uppercase link</Link>
export const GrayLink = () => <Link colorgrey000>This is a gray link</Link>
