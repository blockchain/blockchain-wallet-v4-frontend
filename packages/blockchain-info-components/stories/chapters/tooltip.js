import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { MenuTooltip, Tooltip } from '../../src'

storiesOf('Tooltip', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Tooltip', () => <Tooltip>This is a tooltip.</Tooltip>)
  .add('MenuTooltip', () => <MenuTooltip title='MenuTooltip title'>This is a MenuTooltip.</MenuTooltip>)
