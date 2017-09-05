import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Text, TextGroup } from '../../src'

storiesOf('TextGroup', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('TextGroup not inline', () => <TextGroup><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
  .add('TextGroup inline', () => <TextGroup inline><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
  .add('TextGroup nowrap', () => <TextGroup nowrap><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
