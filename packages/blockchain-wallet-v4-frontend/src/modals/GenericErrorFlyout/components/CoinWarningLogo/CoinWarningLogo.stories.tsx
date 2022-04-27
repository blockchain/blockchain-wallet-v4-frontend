import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Padding } from 'components/Padding'

import { CoinWarningLogo, CoinWarningLogoComponent } from '.'

export default {
  argTypes: {
    severity: {
      defaultValue: 'warning'
    }
  },
  component: CoinWarningLogo,
  title: 'Flyouts/GenericErrorFlyout/CoinWarningLogo'
} as ComponentMeta<CoinWarningLogoComponent>

const Template: ComponentStory<CoinWarningLogoComponent> = (args) => (
  <Padding all={10}>
    <CoinWarningLogo {...args} />
  </Padding>
)

export const BTC = Template.bind({})
BTC.args = {
  coin: 'BTC'
}

export const ETH = Template.bind({})
ETH.args = {
  coin: 'ETH'
}
