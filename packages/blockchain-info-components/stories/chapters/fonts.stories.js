import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Text } from '../../src'

addDecorator(withInfo)

const sample = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export default {
  title: 'Fonts',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const Inter = () => (
  <div>
    <Text size='20px' weight={100}>
      {sample}
    </Text>
    <Text size='20px' weight={400}>
      {sample}
    </Text>
    <Text size='20px' weight={400}>
      {sample}
    </Text>
    <Text size='20px' weight={500}>
      {sample}
    </Text>
    <Text size='20px' weight={500}>
      {sample}
    </Text>
    <Text size='20px' weight={600}>
      {sample}
    </Text>
    <Text size='20px' weight={700}>
      {sample}
    </Text>
    <Text size='20px' weight={800}>
      {sample}
    </Text>
    <Text size='20px' weight={900}>
      {sample}
    </Text>
  </div>
)
