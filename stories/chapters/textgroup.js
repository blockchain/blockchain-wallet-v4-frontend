import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Text, TextGroup } from '../../src'

storiesOf('TextGroup', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('TextGroup not aligned', () => <TextGroup><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
  .add('TextGroup aligned', () => <TextGroup aligned><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
