import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Banner } from '../../src'

storiesOf('Banners', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Alert', () => <Banner type='alert'>This is an alert banner</Banner>)
  .add('Default', () => <Banner>Hello, I'm a standard banner!</Banner>)
  .add('Success', () => <Banner type='success'>Hooray, something worked!</Banner>)
  .add('Warning', () => <Banner type='warning'>Something really bad happened</Banner>)
  .add('Caution', () => <Banner type='caution'>Be careful, use caution with this action</Banner>)
  .add('Informational', () => <Banner type='informational'>Watch Only</Banner>)
