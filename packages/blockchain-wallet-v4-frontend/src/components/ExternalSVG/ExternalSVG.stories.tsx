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
  height: 3,
  src: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/410.svg',
  width: 3
}

export const FailedToLoadWithCallback = Template.bind({})
FailedToLoadWithCallback.args = {
  fallback: <Image name='empty-search' width='100%' height='100%' />,
  height: 3,
  src: 'https://dev.w3.org/should_fail',
  width: 3
}
