import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { TabMenu, TabMenuItem } from '../../src'

storiesOf('Menus', module)
  .addDecorator(story => (<Layout>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('TabMenu', () =>
    <TabMenu>
      <TabMenuItem>Item 1</TabMenuItem>
      <TabMenuItem>Item 2</TabMenuItem>
      <TabMenuItem>Item 3</TabMenuItem>
    </TabMenu>
  )
  .add('TabMenu with selected item', () =>
    <TabMenu>
      <TabMenuItem selected>Item 1</TabMenuItem>
      <TabMenuItem>Item 2</TabMenuItem>
      <TabMenuItem>Item 3</TabMenuItem>
    </TabMenu>
  )
