import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CircularProgress, CircularProgressComponent } from '.'

export default {
  component: CircularProgress,
  title: 'Components/CircularProgress'
} as ComponentMeta<CircularProgressComponent>

const Template: ComponentStory<CircularProgressComponent> = (args) => (
  <Icon label='circular-progress' size='lg' color='blue600'>
    <CircularProgress {...args} />
  </Icon>
)

export const Default = Template.bind({})
Default.args = {
  value: 60
}
