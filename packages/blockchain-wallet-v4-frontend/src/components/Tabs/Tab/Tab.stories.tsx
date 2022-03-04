import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Tab, TabComponent } from '.'

const tabStoriesMeta: ComponentMeta<TabComponent> = {
  argTypes: {
    onClick: {
      control: { type: 'select' },
      defaultValue: 'no_handler',
      mapping: {
        handler: () => null,
        no_handler: null
      },
      options: ['no_handler', 'handler']
    }
  },
  component: Tab,
  title: 'Components/Tabs/Tab'
}

const Template: ComponentStory<TabComponent> = (args) => <Tab {...args} />

export const Default = Template.bind({})
Default.args = {
  children: '1 day'
}

export const Live = Template.bind({})
Live.args = {
  badgeColor: 'green',
  children: 'Live',
  selected: true
}

export default tabStoriesMeta
