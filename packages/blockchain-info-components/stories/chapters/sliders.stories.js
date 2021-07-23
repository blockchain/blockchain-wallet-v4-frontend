import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { SimpleSlider } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Sliders',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _SimpleSlider = () => <SimpleSlider />

_SimpleSlider.story = {
  name: 'SimpleSlider'
}
