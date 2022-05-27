import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Divider, DividerComponent } from '.'

const dividerStoriesMeta: ComponentMeta<DividerComponent> = {
  component: Divider,
  title: 'Structural/Divider'
}

const Template: ComponentStory<DividerComponent> = (args) => <Divider {...args} />

export const Default = Template.bind({})

export default dividerStoriesMeta
