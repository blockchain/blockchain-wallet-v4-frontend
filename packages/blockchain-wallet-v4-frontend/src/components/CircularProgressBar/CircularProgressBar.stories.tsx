import React, { FC } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import CircularProgressBar, { Props } from '.'

export default {
  component: CircularProgressBar,
  title: 'Components/CircularProgressBar'
} as ComponentMeta<FC<Props>>

const Template: ComponentStory<FC<Props>> = (args) => <CircularProgressBar {...args} />

export const Default = Template.bind({})
Default.args = {
  percentage: 60
}
