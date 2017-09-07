import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Link } from '../../src'

storiesOf('Links', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Link', () => <Link>This is a link</Link>)
  .add('Bold Link', () => <Link weight={900}>This is a bold link</Link>)
  .add('Uppercase Link', () => <Link uppercase>This is an uppercase link</Link>)
  .add('Gray Link', () => <Link color='gray-1'>This is a gray link</Link>)
