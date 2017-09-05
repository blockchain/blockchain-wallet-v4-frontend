import React from 'react'
import { storiesOf } from '@storybook/react'

import Layout from '../components/layout'
import Welcome from '../components/welcome'

storiesOf('Welcome', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .add('Introduction', () => <Welcome />)
