import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { NewDropdown } from '../../src'

storiesOf('Dropdowns', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('New dropdown', () => <NewDropdown items={[{text: 'English', value: 0}, {text: 'French', value: 1}, {text: 'Spanish', value: 2}]} callback={function(item){console.log(item)}}></NewDropdown>)
