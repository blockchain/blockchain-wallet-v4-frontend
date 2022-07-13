import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Image } from 'blockchain-info-components'

import { ExternalSVG, ExternalSVGComponent } from '.'

export default {
  component: ExternalSVG,
  title: 'Components/ExternalSVG'
} as ComponentMeta<ExternalSVGComponent>

const Template: ComponentStory<ExternalSVGComponent> = (args) => <ExternalSVG {...args} />

export const Default = Template.bind({})
Default.args = {
  fallback: <Image name='empty-search' width='100%' height='100%' />,
  height: 3,
  href: 'https://blockchain.com/storage/general.svg',
  width: 3
}
