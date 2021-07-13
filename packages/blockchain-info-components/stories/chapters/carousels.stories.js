import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Carousel } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Carousels',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _Carousel = () => (
  <Carousel>
    <span>My first content</span>
    <span>My second content</span>
    <span>My third content</span>
  </Carousel>
)

export const CarouselWithHeight = () => (
  <Carousel height={60}>
    <span>My first content</span>
    <span>My second content</span>
    <span>My third content</span>
  </Carousel>
)

CarouselWithHeight.story = {
  name: 'Carousel with height'
}

export const CarouselWithAuto = () => (
  <Carousel auto>
    <span>My first content</span>
    <span>My second content</span>
    <span>My third content</span>
  </Carousel>
)

CarouselWithAuto.story = {
  name: 'Carousel with auto'
}

export const CarouselWithDelay = () => (
  <Carousel auto delay={1000}>
    <span>My first content</span>
    <span>My second content</span>
    <span>My third content</span>
  </Carousel>
)

CarouselWithDelay.story = {
  name: 'Carousel with delay'
}

export const CarouselWithArrowsDisabled = () => (
  <Carousel arrows={false}>
    <span>My first content</span>
    <span>My second content</span>
    <span>My third content</span>
  </Carousel>
)

CarouselWithArrowsDisabled.story = {
  name: 'Carousel with arrows disabled'
}

export const CarouselWithChipsDisabled = () => (
  <Carousel chips={false}>
    <span>My first content</span>
    <span>My second content</span>
    <span>My third content</span>
  </Carousel>
)

CarouselWithChipsDisabled.story = {
  name: 'Carousel with chips disabled'
}
