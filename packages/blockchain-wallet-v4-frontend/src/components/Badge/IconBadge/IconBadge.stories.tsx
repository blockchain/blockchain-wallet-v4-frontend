import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconActivity } from '@blockchain-com/icons'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { IconBadge } from './IconBadge'
import { IconBadgeComponent } from './IconBadge.types'

export default {
  component: IconBadge,
  title: 'Components/Badge/IconBadge'
} as ComponentMeta<IconBadgeComponent>

const Template: ComponentStory<IconBadgeComponent> = (args) => (
  <div style={{ backgroundColor: 'grey', padding: 10 }}>
    <IconBadge {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  backgroundColor: 'orange',
  children: (
    <Icon label='' size='sm' color='orange600'>
      <IconActivity />
    </Icon>
  )
}
