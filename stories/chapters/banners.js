import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Banner } from '../../src'

storiesOf('Banners', module)
    .addDecorator(story => (<Layout>{story()}</Layout>))
    .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
    .add('Alert', () => <Banner type="alert" text="This is an alert message" />)
    .add('Default', () => <Banner text="Hello, I'm a standard banner!" />)
    .add('Success', () => <Banner type="success" text="Hooray, something worked!" />)
    .add('Warning', () => <Banner type="warning" text="Something really bad happened" />)
