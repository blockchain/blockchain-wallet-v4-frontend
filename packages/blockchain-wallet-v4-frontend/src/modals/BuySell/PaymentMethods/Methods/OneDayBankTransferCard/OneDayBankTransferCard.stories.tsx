import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { OneDayBankTransferCard, OneDayBankTransferCardComponent } from '.'

export default {
  component: OneDayBankTransferCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Flyouts/BuySell/PaymentMethods/OneDayBankTransferCard'
} as ComponentMeta<OneDayBankTransferCardComponent>

const Template: ComponentStory<OneDayBankTransferCardComponent> = (args) => (
  <OneDayBankTransferCard {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClick: () => {}
}
