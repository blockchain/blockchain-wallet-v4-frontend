import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Separator } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Separators',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Separator = () => (
  <div>
    <br />
    <Separator />
    <br />
  </div>
)
export const SeparatorWithContent = () => (
  <div>
    <br />
    <Separator>
      <span>My content</span>
    </Separator>
    <br />
  </div>
)

SeparatorWithContent.story = {
  name: 'Separator with content'
}

export const SeparatorWithLeftBar = () => (
  <div>
    <br />
    <Separator align='left'>
      <span>My content</span>
    </Separator>
    <br />
  </div>
)

SeparatorWithLeftBar.story = {
  name: 'Separator with left bar'
}

export const SeparatorWithRightBar = () => (
  <div>
    <br />
    <Separator align='right'>
      <span>My content</span>
    </Separator>
    <br />
  </div>
)

SeparatorWithRightBar.story = {
  name: 'Separator with right bar'
}
