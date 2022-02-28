import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SymetricPadding, SymetricPaddingComponent } from '.'

const symetricPaddingStoriesMeta: ComponentMeta<SymetricPaddingComponent> = {
  argTypes: {
    children: {
      defaultValue: <span>Padding context</span>
    },
    horizontal: {
      defaultValue: 10
    },
    vertical: {
      defaultValue: 10
    }
  },
  component: SymetricPadding,
  title: 'Components/Padding/Symetric'
}

export const Horizontal16Vertical10: ComponentStory<SymetricPaddingComponent> = ({
  children,
  horizontal,
  vertical
}) => (
  <div style={{ backgroundColor: 'blue', color: 'white' }}>
    <SymetricPadding horizontal={horizontal} vertical={vertical}>
      {children}
    </SymetricPadding>
  </div>
)
Horizontal16Vertical10.args = {
  horizontal: 16,
  vertical: 10
}

export default symetricPaddingStoriesMeta
