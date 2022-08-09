import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Tag, TagComponent } from '.'

export default {
  args: {
    children: 'Tag'
  },
  component: Tag,
  title: 'Components/Tag'
} as ComponentMeta<TagComponent>

const Template: ComponentStory<TagComponent> = (args) => <Tag {...args} />

export const Warning = Template.bind({})
Warning.args = {
  variant: 'warning'
}

export const Error = Template.bind({})
Error.args = {
  variant: 'error'
}
