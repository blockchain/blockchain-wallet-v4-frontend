import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { ConfirmationGauge, PasswordGauge, SecurityGauge } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Gauges',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _ConfirmationGauge = () => (
  <div>
    <ConfirmationGauge />
    <ConfirmationGauge nbConfirmations={1} />
    <ConfirmationGauge nbConfirmations={2} />
    <ConfirmationGauge nbConfirmations={3} />
  </div>
)

_ConfirmationGauge.story = {
  name: 'ConfirmationGauge'
}

export const _PasswordGauge = () => (
  <div>
    <PasswordGauge score={1} />
    <PasswordGauge score={2} />
    <PasswordGauge score={3} />
    <PasswordGauge score={4} />
    <PasswordGauge score={5} />
  </div>
)

_PasswordGauge.story = {
  name: 'PasswordGauge'
}

export const _SecurityGauge = () => (
  <div>
    <SecurityGauge score={0} />
    <SecurityGauge score={1} />
    <SecurityGauge score={2} />
    <SecurityGauge score={3} />
    <SecurityGauge score={4} />
    <SecurityGauge score={5} />
    <SecurityGauge score={6} />
  </div>
)

_SecurityGauge.story = {
  name: 'SecurityGauge'
}
