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
  .add('Simple dropup', () => <SimpleDropdown items={ items } callback={ callback }></SimpleDropdown>)
  .add('Dropup with second value selected', () => <SimpleDropdown selectedValue={2} items={ items } callback={ callback }></SimpleDropdown>)
  .add('Lowercase dropup', () => <SimpleDropdown uppercase={false} selectedValue={2} items={ items } callback={ callback }></SimpleDropdown>)
  .add('Navy colored dropup', () => <SimpleDropdown color={ 'navy' } items={ items } callback={ callback }></SimpleDropdown>)
  .add('Opened dropup', () => <SimpleDropdown opened items={ items } callback={ callback }></SimpleDropdown>)
  .add('Simple dropdown', () => <SimpleDropdown down items={ items } callback={ callback }></SimpleDropdown>)
