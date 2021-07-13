import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import {
  BlockchainLoader,
  FlatLoader,
  FlatLoader2,
  HeartbeatLoader,
  SpinningLoader
} from '../../src'
import Layout from '../components/layout'

addDecorator(withInfo)

export default {
  title: 'Loaders',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _BlockchainLoader = () => <BlockchainLoader />

_BlockchainLoader.story = {
  name: 'BlockchainLoader'
}

export const _FlatLoader = () => <FlatLoader />

_FlatLoader.story = {
  name: 'FlatLoader'
}

export const FlatLoaderWithWidthAndHeight = () => <FlatLoader width='100px' height='30px' />

FlatLoaderWithWidthAndHeight.story = {
  name: 'FlatLoader with width and height'
}

export const FlatLoaderWithColor = () => <FlatLoader color='red600' />

FlatLoaderWithColor.story = {
  name: 'FlatLoader with color'
}

export const _FlatLoader2 = () => <FlatLoader2 />

_FlatLoader2.story = {
  name: 'FlatLoader2'
}

export const FlatLoader2WithWidthHeight = () => <FlatLoader2 width='100px' height='30px' />

FlatLoader2WithWidthHeight.story = {
  name: 'FlatLoader2 with width, height'
}

export const FlatLoader2WithColor = () => <FlatLoader2 color='red600' />

FlatLoader2WithColor.story = {
  name: 'FlatLoader2 with color'
}

export const _HeartbeatLoader = () => <HeartbeatLoader />

_HeartbeatLoader.story = {
  name: 'HeartbeatLoader'
}

export const HeartbeatLoaderWithWidthHeight = () => <HeartbeatLoader width='100px' height='30px' />

HeartbeatLoaderWithWidthHeight.story = {
  name: 'HeartbeatLoader with width, height'
}

export const HeartbeatLoaderWithColor = () => <HeartbeatLoader color='red600' />

HeartbeatLoaderWithColor.story = {
  name: 'HeartbeatLoader with color'
}

export const _SpinningLoader = () => <SpinningLoader />

_SpinningLoader.story = {
  name: 'Spinning loader'
}
