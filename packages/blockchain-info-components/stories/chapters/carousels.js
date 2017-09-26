import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Carousel } from '../../src'

storiesOf('Carousels', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Carousel', () =>
    <Carousel>
      <span>My first content</span>
      <span>My second content</span>
      <span>My third content</span>
    </Carousel>)
  .add('Carousel with height', () =>
    <Carousel height={60}>
      <span>My first content</span>
      <span>My second content</span>
      <span>My third content</span>
    </Carousel>)
  .add('Carousel with auto', () =>
    <Carousel auto>
      <span>My first content</span>
      <span>My second content</span>
      <span>My third content</span>
    </Carousel>)
  .add('Carousel with delay', () =>
    <Carousel auto delay={1000}>
      <span>My first content</span>
      <span>My second content</span>
      <span>My third content</span>
    </Carousel>)
  .add('Carousel with arrows disabled', () =>
    <Carousel arrows={false}>
      <span>My first content</span>
      <span>My second content</span>
      <span>My third content</span>
    </Carousel>)
  .add('Carousel with chips disabled', () =>
    <Carousel chips={false}>
      <span>My first content</span>
      <span>My second content</span>
      <span>My third content</span>
    </Carousel>)
