import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Icon } from 'blockchain-info-components'

import { ImageWithSeverity, ImageWithSeverityComponent } from '.'

export default {
  component: ImageWithSeverity,
  title: 'Components/GenericError/ImageWithSeverity'
} as ComponentMeta<ImageWithSeverityComponent>

const Template: ComponentStory<ImageWithSeverityComponent> = (args) => (
  <ImageWithSeverity {...args} />
)

export const BTC = Template.bind({})
BTC.args = {
  children: <Icon size='72px' name='BTC' />
}
