import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { BlockchainLoader, Loader } from '../../src'

storiesOf('Loaders', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Loader', () => <Loader />)
  .add('BlockchainLoader', () => <BlockchainLoader />)
