import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Toast } from '../../src'

storiesOf('Toast', module)
    .addDecorator(story => (<Layout>{story()}</Layout>))
    .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
    .add('Default', () => <Toast action='' title='Alert'>This is what a default toast looks like on desktop.</Toast>)
    .add('Error', () => <Toast type='error' title='Error' action=''>This is what an error toast looks like on desktop.</Toast>)
    .add('Success', () => <Toast type='success' title='Success' action=''>This is what a success toast looks like on desktop.</Toast>)
