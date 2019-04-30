import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Text } from '../../src'

const sample = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

storiesOf('Fonts', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('Inter', () => (
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
  ))
