import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { SimpleDropdown } from '../../src'

const items = [
  { text: 'English', value: 0 },
  { text: 'French', value: 1 },
  { text: 'Spanish', value: 2 }
]

const callback = function (item) { console.log(item) }

storiesOf('Dropdowns', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('SimpleDropdown', () => <SimpleDropdown items={items} callback={callback} />)
  .add('SimpleDropdown with second value selected', () => <SimpleDropdown selectedValue={2} items={items} callback={callback} />)
  .add('SimpleDropdown lowercase', () => <SimpleDropdown uppercase={false} items={items} callback={callback} />)
  .add('SimpleDropdown white', () => <SimpleDropdown color='white' items={items} callback={callback} />)
  .add('SimpleDropdown opened', () => <SimpleDropdown opened items={items} callback={callback} />)
  .add('Simple dropdown opening down', () => <SimpleDropdown down items={items} callback={callback} />)
