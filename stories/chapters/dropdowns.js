import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { SimpleDropdown } from '../../src'

let items = [{text: 'English', value: 0},
             {text: 'French', value: 1},
             {text: 'Spanish', value: 2}]

let callback = function (item) {
  console.log(item)
}

storiesOf('Dropdowns', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Simple dropdown', () => <SimpleDropdown items={ items } callback={ callback }></SimpleDropdown>)
  .add('Dropdown with second value selected', () => <SimpleDropdown selectedValue={2} items={ items } callback={ callback }></SimpleDropdown>)
  .add('Lowercase dropdown', () => <SimpleDropdown uppercase={false} selectedValue={2} items={ items } callback={ callback }></SimpleDropdown>)
  .add('Navy colored dropdown', () => <SimpleDropdown color={ 'navy' } items={ items } callback={ callback }></SimpleDropdown>)
  .add('Opened dropdown', () => <SimpleDropdown opened items={ items } callback={ callback }></SimpleDropdown>)
