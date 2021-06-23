import { withInfo } from '@storybook/addon-info'
import React, { Fragment } from 'react'
import { addDecorator } from '@storybook/react'

import { Tooltip, TooltipHost, TooltipIcon } from '../../src'
import Layout from '../components/layout'

addDecorator(withInfo)

export default {
  title: 'Tooltip',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Tooltip = () => (
  <Fragment>
    <Tooltip id='storybook.tooltip'>
      <span>This is a tooltip of a component.</span>
    </Tooltip>
    <TooltipHost id='storybook.tooltip'>
      <TooltipIcon name='info' />
    </TooltipHost>
  </Fragment>
)
