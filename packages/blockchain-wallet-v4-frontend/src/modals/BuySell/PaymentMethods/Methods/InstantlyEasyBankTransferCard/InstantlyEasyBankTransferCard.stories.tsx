import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { InstantlyEasyBankTransferCard, InstantlyEasyBankTransferCardComponent } from '.'

export default {
  component: InstantlyEasyBankTransferCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Flyouts/BuySell/PaymentMethods/InstantlyEasyBankTransferCard'
} as ComponentMeta<InstantlyEasyBankTransferCardComponent>

const Template: ComponentStory<InstantlyEasyBankTransferCardComponent> = (args) => (
  <InstantlyEasyBankTransferCard {...args} />
)

export const Default = Template.bind({})
