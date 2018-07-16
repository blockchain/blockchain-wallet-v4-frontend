import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Badge } from '../../src'

storiesOf('Badges', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Apple Store Badge', () => <Badge type='applestore' />)
  .add('Google Play Badge', () => <Badge type='googleplay' />)
