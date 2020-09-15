import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import React from 'react'

import {
  BlockchainLoader,
  FlatLoader,
  FlatLoader2,
  HeartbeatLoader,
  SpinningLoader
} from '../../src'
import Layout from '../components/layout'

storiesOf('Loaders', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('BlockchainLoader', () => <BlockchainLoader />)
  .add('FlatLoader', () => <FlatLoader />)
  .add('FlatLoader with width and height', () => (
    <FlatLoader width='100px' height='30px' />
  ))
  .add('FlatLoader with color', () => <FlatLoader color='red600' />)
  .add('FlatLoader2', () => <FlatLoader2 />)
  .add('FlatLoader2 with width, height', () => (
    <FlatLoader2 width='100px' height='30px' />
  ))
  .add('FlatLoader2 with color', () => <FlatLoader2 color='red600' />)
  .add('HeartbeatLoader', () => <HeartbeatLoader />)
  .add('HeartbeatLoader with width, height', () => (
    <HeartbeatLoader width='100px' height='30px' />
  ))
  .add('HeartbeatLoader with color', () => <HeartbeatLoader color='red600' />)
  .add('Spinning loader', () => <SpinningLoader />)
