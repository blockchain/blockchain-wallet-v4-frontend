import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Separator } from '../../src'

storiesOf('Separators', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Separator', () => <div><br /><Separator /><br /></div>)
  .add('Separator with content', () => <div><br /><Separator><span>My content</span></Separator><br /></div>)
  .add('Separator with left bar', () => <div><br /><Separator align='left'><span>My content</span></Separator><br /></div>)
  .add('Separator with right bar', () => <div><br /><Separator align='right'><span>My content</span></Separator><br /></div>)
