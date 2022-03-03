import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { PaddingSymetric, PaddingSymetricComponent } from '.'

const PaddingSymetricStoriesMeta: ComponentMeta<PaddingSymetricComponent> = {
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
  component: PaddingSymetric,
  title: 'Components/Padding/Symetric'
}

export const Horizontal16Vertical10: ComponentStory<PaddingSymetricComponent> = ({
  children,
  horizontal,
  vertical
}) => (
  <div style={{ backgroundColor: 'blue', color: 'white' }}>
    <PaddingSymetric horizontal={horizontal} vertical={vertical}>
      {children}
    </PaddingSymetric>
  </div>
)
Horizontal16Vertical10.args = {
  horizontal: 16,
  vertical: 10
}

export default PaddingSymetricStoriesMeta
