import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Card, CardComponent } from '.'

const cardStoriesMeta: ComponentMeta<CardComponent> = {
  component: Card,
  title: 'Structural/Card'
}

const Template: ComponentStory<CardComponent> = (args) => <Card {...args} />

export const NoElevation = Template.bind({})
NoElevation.args = {
  children: <span>no elevation</span>
}

export const ElevationOne = Template.bind({})
ElevationOne.args = {
  children: <span>elevation 1</span>,
  elevation: 1
}

export const GreyBackground = Template.bind({})
GreyBackground.args = {
  backgroundColor: 'grey-400',
  borderRadius: 'lg',
  children: <span>elevation 1</span>
}

export default cardStoriesMeta
