import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Toast } from '../../src'

storiesOf('Toast', module)
    .addDecorator(story => (<Layout height='600px'>{story()}</Layout>))
    .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
    .add('Default', () =>
      <Toast>
        <span>Alert</span>
        <span>This is what a default toast looks like on desktop.</span>
      </Toast>)
    .add('Error', () =>
      <Toast nature='error'>
        <span>Error</span>
        <span>This is what an error toast looks like on desktop.</span>
      </Toast>)
    .add('Success', () =>
      <Toast nature='success'>
        <span>Success</span>
        <span>This is what a success toast looks like on desktop.</span>
      </Toast>)
