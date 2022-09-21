import React from 'react'
import { IconSend, PaletteColors } from '@blockchain-com/constellation'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from './Button'
import { ButtonComponent } from './Button.types'

export default {
  argTypes: {
    nature: {
      control: {
        type: 'select'
      },
      defaultValue: 'primary'
    }
  },
  component: Button,
  title: 'Pages/CoinPage/Button'
} as ComponentMeta<ButtonComponent>

const Template: ComponentStory<ButtonComponent> = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Click me',
  'data-e2e': 'test',
  icon: <IconSend label='send' color={PaletteColors['white-900']} size='small' />
}
