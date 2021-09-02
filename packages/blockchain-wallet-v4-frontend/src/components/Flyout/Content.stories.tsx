import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Content from './Content'

export default {
  component: Content,
  title: 'Flyouts/Content'
} as ComponentMeta<typeof Content>

const Template: ComponentStory<typeof Content> = (args) => (
  <Content {...args}>
    <p style={{ width: '200px' }}>
      You&apos;ll typically put FlyoutHeader, FlyoutContent, and FlyoutFooter in me to get nicely
      styled flyout that works out of the box!
    </p>
  </Content>
)

export const Default = Template.bind({})
Default.args = {
  mode: 'top'
}

export const MiddleFloating = Template.bind({})
MiddleFloating.args = {
  mode: 'middle'
}
