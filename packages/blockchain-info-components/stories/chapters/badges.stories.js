import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Badge } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Badges',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const AppleStoreBadge = () => <Badge type='applestore' />
export const GooglePlayBadge = () => <Badge type='googleplay' />
