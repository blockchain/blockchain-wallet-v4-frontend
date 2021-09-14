import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Text } from 'blockchain-info-components'

import OptionRightActionRow from './OptionRightAction'

export default {
  args: {
    children: (
      <>
        <Text weight={600} size='16px' color='grey900'>
          Daily
        </Text>
        <Text weight={500} size='14px' color='grey600'>
          at 9am
        </Text>
      </>
    ),
    disabled: false
  },
  component: OptionRightActionRow,
  title: 'Rows/OptionRightActionRow'
} as ComponentMeta<typeof OptionRightActionRow>

const Template: ComponentStory<typeof OptionRightActionRow> = (args) => (
  <OptionRightActionRow {...args} />
)

export const Default = Template.bind({})

export const Disabled = Template.bind({})
Disabled.args = { disabled: true }
