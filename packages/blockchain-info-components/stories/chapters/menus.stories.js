import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { TabMenu, TabMenuItem } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Menus',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const _TabMenu = () => (
  <TabMenu>
    <TabMenuItem>Item 1</TabMenuItem>
    <TabMenuItem>Item 2</TabMenuItem>
    <TabMenuItem>Item 3</TabMenuItem>
  </TabMenu>
)

_TabMenu.story = {
  name: 'TabMenu'
}

export const TabMenuWithSelectedItem = () => (
  <TabMenu>
    <TabMenuItem selected>Item 1</TabMenuItem>
    <TabMenuItem>Item 2</TabMenuItem>
    <TabMenuItem>Item 3</TabMenuItem>
  </TabMenu>
)

TabMenuWithSelectedItem.story = {
  name: 'TabMenu with selected item'
}
