import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { ConfirmationGauge } from '../../src'

storiesOf('Gauges', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('ConfirmationGauge empty', () => <ConfirmationGauge />)
  .add('ConfirmationGauge orange', () => <ConfirmationGauge nbConfirmations={1} />)
  .add('ConfirmationGauge yellow', () => <ConfirmationGauge nbConfirmations={2} />)
  .add('ConfirmationGauge green', () => <ConfirmationGauge nbConfirmations={3} />)
