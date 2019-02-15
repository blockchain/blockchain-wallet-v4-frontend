import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Tooltip, TooltipHost, TooltipIcon } from '../../src'

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
        <TooltipIcon name='question-in-circle' />
      </TooltipHost>
    </Fragment>
  ))
