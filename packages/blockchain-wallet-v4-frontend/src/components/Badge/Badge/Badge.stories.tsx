import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Badge, BadgeComponent } from '.'

export default {
  argTypes: {
    outlineSize: {
      defaultValue: 0.25
    },
    size: {
      defaultValue: 2
    }
  },
  component: Badge,
  title: 'Components/Badge/Badge'
} as ComponentMeta<BadgeComponent>

const Template: ComponentStory<BadgeComponent> = (args) => (
  <div style={{ backgroundColor: 'grey', padding: 10 }}>
    <Badge {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  backgroundColor: 'blue',
  children: <span style={{ color: 'white' }}>1</span>
}

export const Larger = Template.bind({})
Larger.args = {
  backgroundColor: 'blue',
  children: <span style={{ color: 'white' }}>12345</span>
}
