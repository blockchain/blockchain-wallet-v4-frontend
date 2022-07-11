import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { SameDayBankTransferCard, SameDayBankTransferCardComponent } from '.'

export default {
  component: SameDayBankTransferCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Flyouts/BuySell/PaymentMethods/SameDayBankTransferCard'
} as ComponentMeta<SameDayBankTransferCardComponent>

const Template: ComponentStory<SameDayBankTransferCardComponent> = (args) => (
  <SameDayBankTransferCard {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClick: () => {}
}
