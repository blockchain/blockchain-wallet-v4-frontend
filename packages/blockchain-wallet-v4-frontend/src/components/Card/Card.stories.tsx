import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Card, CardComponent } from '.'

const cardStoriesMeta: ComponentMeta<CardComponent> = {
  component: Card,
  title: 'Components/Card'
}

const Template: ComponentStory<CardComponent> = (args) => <Card {...args} />

export const NoElevation = Template.bind({})
NoElevation.args = {
  children: <span>no elevation</span>,
  elevation: 0
}

export const ElevationOne = Template.bind({})
ElevationOne.args = {
  children: <span>elevation 1</span>,
  elevation: 1
}

export default cardStoriesMeta
