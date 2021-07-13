import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

addDecorator(withInfo)

import Layout from '../components/layout'
import { SimpleDropdown } from '../../src'

const items = [
  { text: 'English', value: 0 },
  { text: 'French', value: 1 },
  { text: 'Spanish', value: 2 }
]

const callback = function (item) {
  console.log(item)
}

export default {
  title: 'Dropdowns',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _SimpleDropdown = () => <SimpleDropdown items={items} callback={callback} />

_SimpleDropdown.story = {
  name: 'SimpleDropdown'
}

export const SimpleDropdownWithSecondValueSelected = () => (
  <SimpleDropdown selectedValue={2} items={items} callback={callback} />
)

SimpleDropdownWithSecondValueSelected.story = {
  name: 'SimpleDropdown with second value selected'
}

export const SimpleDropdownLowercase = () => (
  <SimpleDropdown uppercase={false} items={items} callback={callback} />
)

SimpleDropdownLowercase.story = {
  name: 'SimpleDropdown lowercase'
}

export const SimpleDropdownWhite = () => (
  <SimpleDropdown color='white' items={items} callback={callback} />
)

SimpleDropdownWhite.story = {
  name: 'SimpleDropdown white'
}

export const SimpleDropdownOpened = () => (
  <SimpleDropdown opened items={items} callback={callback} />
)

SimpleDropdownOpened.story = {
  name: 'SimpleDropdown opened'
}

export const SimpleDropdownOpeningDown = () => (
  <SimpleDropdown down items={items} callback={callback} />
)

SimpleDropdownOpeningDown.story = {
  name: 'Simple dropdown opening down'
}
