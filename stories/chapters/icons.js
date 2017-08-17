import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import IconLayout from '../components/iconLayout'
import { Icon } from '../../src'

storiesOf('Icons', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('icomoon', () =>
    <IconLayout>
      <Icon name='skinny-arrow-right' />
      <Icon name='paper-airplane' />
      <Icon name='alert' />
      <Icon name='completed-check' />
      <Icon name='exchange-tab' />
      <Icon name='bell' />
      <Icon name='clipboard' />
      <Icon name='pencil' />
      <Icon name='buysell' />
      <Icon name='ethereum' />
      <Icon name='always-supported' />
      <Icon name='buy-sell' />
      <Icon name='global' />
      <Icon name='safe-secure' />
      <Icon name='simple' />
      <Icon name='phone' />
      <Icon name='downtriangle' />
      <Icon name='bank' />
      <Icon name='bitcoin' />
      <Icon name='card' />
      <Icon name='down_arrow' />
      <Icon name='export' />
      <Icon name='help' />
      <Icon name='home' />
      <Icon name='id' />
      <Icon name='left_arrow' />
      <Icon name='lock' />
      <Icon name='mail' />
      <Icon name='mobile' />
      <Icon name='present' />
      <Icon name='receive' />
      <Icon name='right_arrow' />
      <Icon name='search' />
      <Icon name='send' />
      <Icon name='settings' />
      <Icon name='success' />
      <Icon name='trash' />
      <Icon name='tx' />
      <Icon name='up_arrow' />
      <Icon name='wallet' />
      <Icon name='user' />
    </IconLayout>
  )
