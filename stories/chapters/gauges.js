import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { ConfirmationGauge, PasswordGauge } from '../../src'

storiesOf('Gauges', module)
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('ConfirmationGauge', () => (
    <Layout>
      <ConfirmationGauge />
      <ConfirmationGauge nbConfirmations={1} />
      <ConfirmationGauge nbConfirmations={2} />
      <ConfirmationGauge nbConfirmations={3} />
    </Layout>
  ))
  .add('PasswordGauge', () => (
    <Layout>
      <PasswordGauge score={1} />
      <PasswordGauge score={2} />
      <PasswordGauge score={3} />
      <PasswordGauge score={4} />
      <PasswordGauge score={5} />
    </Layout>
  ))
