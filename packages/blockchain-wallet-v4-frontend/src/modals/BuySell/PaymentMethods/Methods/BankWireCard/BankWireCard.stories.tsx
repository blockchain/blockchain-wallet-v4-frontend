import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { BSPaymentTypes } from '@core/types'

import { BankWireCard, BankWireCardProps } from '.'

export default {
  component: BankWireCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'modals/BuySell/PaymentMethods/BankWireCard'
} as ComponentMeta<React.FC<BankWireCardProps>>

const Template: ComponentStory<React.FC<BankWireCardProps>> = (args) => <BankWireCard {...args} />

export const Default = Template.bind({})
Default.args = {
  text: 'Bank Transfer',
  value: {
    currency: 'USD',
    limits: {
      max: '1000',
      min: '10'
    },
    type: BSPaymentTypes.BANK_ACCOUNT
  }
}
