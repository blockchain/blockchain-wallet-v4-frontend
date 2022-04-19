import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Padding, PaddingComponent } from '.'

const paddingStoriesMeta: ComponentMeta<PaddingComponent> = {
  argTypes: {
    children: {
      defaultValue: <span>Padding context</span>
    }
  },
  component: Padding,
  title: 'Components/Padding'
}

const Template: ComponentStory<PaddingComponent> = ({ bottom, children, left, right, top }) => (
  <div style={{ backgroundColor: 'blue', color: 'white' }}>
    <Padding top={top} bottom={bottom} left={left} right={right}>
      <div style={{ backgroundColor: 'red' }}>{children}</div>
    </Padding>
  </div>
)

export const PaddingEdgeInset = Template.bind({})
PaddingEdgeInset.args = {
  bottom: 40,
  left: 20,
  right: 30,
  top: 10
}

export const PaddingSymetric = Template.bind({})
PaddingSymetric.args = {
  horizontal: 20,
  vertical: 10
}

export const PaddingAll = Template.bind({})
PaddingAll.args = {
  all: 10
}

export default paddingStoriesMeta
