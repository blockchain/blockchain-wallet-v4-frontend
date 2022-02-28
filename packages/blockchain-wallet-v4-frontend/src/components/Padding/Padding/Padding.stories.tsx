import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Padding, PaddingComponent } from '.'

const paddingStoriesMeta: ComponentMeta<PaddingComponent> = {
  argTypes: {
    bottom: {
      defaultValue: 10
    },
    children: {
      defaultValue: <span>Padding context</span>
    },
    left: {
      defaultValue: 10
    },
    right: {
      defaultValue: 10
    },
    top: {
      defaultValue: 10
    }
  },
  component: Padding,
  title: 'Components/Padding'
}

export const Sample: ComponentStory<PaddingComponent> = ({
  bottom,
  children,
  left,
  right,
  top
}) => (
  <div style={{ backgroundColor: 'blue', color: 'white' }}>
    <Padding top={top} bottom={bottom} left={left} right={right}>
      {children}
    </Padding>
  </div>
)

export default paddingStoriesMeta
