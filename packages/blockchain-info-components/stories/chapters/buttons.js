import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Button, ButtonGroup, IconButton } from '../../src'

storiesOf('Buttons', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Button', () => <Button>Button</Button>)
  .add('Button empty', () => <Button nature='empty'>Button empty</Button>)
  .add('Button primary', () => <Button nature='primary'>Button primary</Button>)
  .add('Button secondary', () => <Button nature='secondary'>Button secondary</Button>)
  .add('Button copy', () => <Button nature='copy'>Button copy</Button>)
  .add('Button received', () => <Button nature='received'>Button received</Button>)
  .add('Button sent', () => <Button nature='sent'>Button sent</Button>)
  .add('Button transferred', () => <Button nature='transferred'>Button transferred</Button>)
  .add('Button logout', () => <Button nature='logout'>Button logout</Button>)
  .add('Button rounded', () => <Button rounded>Button rounded</Button>)
  .add('Button fullwidth', () => <Button fullwidth>Button fullwidth</Button>)
  .add('Button disabled', () => <Button disabled>Button disabled</Button>)
  .add('Button bold', () => <Button bold>Button bold</Button>)
  .add('Button uppercase', () => <Button uppercase>Button uppercase</Button>)
  .add('ButtonGroup with 2 buttons', () => (<ButtonGroup><Button>Button 1</Button><Button>Button 2</Button></ButtonGroup>))
  .add('ButtonGroup with 3 buttons', () => (<ButtonGroup><Button>Button 1</Button><Button>Button 2</Button><Button>Button 3</Button></ButtonGroup>))
  .add('Button icon send', () => <IconButton name='send' />)
