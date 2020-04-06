import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import React from 'react'

import { Link } from '../../src'
import Layout from '../components/layout'

storiesOf('Links', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('Link', () => <Link>This is a link</Link>)
  .add('Bold Link', () => <Link weight={900}>This is a bold link</Link>)
  .add('Uppercase Link', () => <Link uppercase>This is an uppercase link</Link>)
  .add('Gray Link', () => <Link colorgrey000>This is a gray link</Link>)
