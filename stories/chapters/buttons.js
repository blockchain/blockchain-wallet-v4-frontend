import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Button, ButtonGroup } from '../../src'

storiesOf('Buttons', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Button', () => <Button>Button</Button>)
  .add('Button primary', () => <Button type='primary'>Button primary</Button>)
  .add('Button secondary', () => <Button type='secondary'>Button secondary</Button>)
  .add('Button rounded', () => <Button rounded>Button rounded</Button>)
  .add('Button fullwidth', () => <Button fullwidth>Button fullwidth</Button>)
  .add('Button disabled', () => <Button disabled>Button disabled</Button>)
  .add('Button bold', () => <Button bold>Button bold</Button>)
  .add('Button uppercase', () => <Button uppercase>Button uppercase</Button>)
  .add('ButtonGroup with 2 buttons', () => (<ButtonGroup><Button>Button 1</Button><Button>Button 2</Button></ButtonGroup>))
  .add('ButtonGroup with 3 buttons', () => (<ButtonGroup><Button>Button 1</Button><Button>Button 2</Button><Button>Button 3</Button></ButtonGroup>))
  .add('Button TEST', () => <Button type='primary' uppercase>Button uppercase</Button>)
