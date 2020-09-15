import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import React, { Fragment } from 'react'

import { Tooltip, TooltipHost, TooltipIcon } from '../../src'
import Layout from '../components/layout'

storiesOf('Tooltip', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('Tooltip', () => (
    <Fragment>
      <Tooltip id='storybook.tooltip'>
        <span>This is a tooltip of a component.</span>
      </Tooltip>
      <TooltipHost id='storybook.tooltip'>
        <TooltipIcon name='info' />
      </TooltipHost>
    </Fragment>
  ))
