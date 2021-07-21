import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Text, TextGroup } from '../../src'

addDecorator(withInfo)

export default {
  title: 'TextGroup',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const TextGroupNotInline = () => (
  <TextGroup>
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
  </TextGroup>
)

TextGroupNotInline.story = {
  name: 'TextGroup not inline'
}

export const TextGroupInline = () => (
  <TextGroup inline>
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
  </TextGroup>
)

TextGroupInline.story = {
  name: 'TextGroup inline'
}

export const TextGroupNowrap = () => (
  <TextGroup nowrap>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </Text>
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
  </TextGroup>
)

TextGroupNowrap.story = {
  name: 'TextGroup nowrap'
}
