import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { WireTransferCard, WireTransferCardComponent } from '.'

export default {
  component: WireTransferCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Flyouts/BuySell/PaymentMethods/WireTransferCard'
} as ComponentMeta<WireTransferCardComponent>

const Template: ComponentStory<WireTransferCardComponent> = (args) => <WireTransferCard {...args} />

export const Default = Template.bind({})
