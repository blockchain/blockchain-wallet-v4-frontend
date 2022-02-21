import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CircularImage, CircularImageComponent, CircularImageRadius } from '.'

const bitcoinImageSrc =
  'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/bitcoin/info/logo.png'

const ethereumImageSrc =
  'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/info/logo.png'

const circularImageStory: ComponentMeta<CircularImageComponent> = {
  argTypes: {
    radius: {
      defaultValue: 'medium',
      options: ['large', 'medium', 'small']
    },
    src: {
      defaultValue: bitcoinImageSrc,
      options: [bitcoinImageSrc, ethereumImageSrc]
    }
  },
  component: CircularImage,
  title: 'Components/CircularImage'
}

const Template: ComponentStory<CircularImageComponent> = (args) => <CircularImage {...args} />

export const Default = Template.bind({})

export const Sizes = () => {
  const radius: CircularImageRadius[] = ['small', 'medium', 'large']

  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
      {radius.map((imageRadius) => (
        <div
          key={imageRadius}
          style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}
        >
          <CircularImage radius={imageRadius} src={bitcoinImageSrc} />
          <span>{imageRadius}</span>
        </div>
      ))}
    </div>
  )
}
Sizes.parameters = {
  docs: {
    storyDescription: 'The redius property also accepts a any number to size the circle image'
  }
}

export const CustomRadius = Template.bind({})
CustomRadius.argTypes = {
  radius: {
    control: { min: 0, step: 2, type: 'number' },
    defaultValue: 10
  }
}
CustomRadius.parameters = {
  docs: {
    storyDescription: 'The redius property also accepts a any number to size the circle image'
  }
}

export default circularImageStory
