import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { NewDropdown } from '../../src'

storiesOf('Dropdowns', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('New dropdown', () => <NewDropdown id={0} display='English' items={[{text: 'French', value: 1}, {text: 'Spanish', value: 2}]} callback={function(value){console.log(value);}}></NewDropdown>)
