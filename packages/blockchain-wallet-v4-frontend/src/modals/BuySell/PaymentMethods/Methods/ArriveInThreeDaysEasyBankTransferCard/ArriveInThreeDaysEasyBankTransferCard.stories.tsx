import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  ArriveInThreeDaysEasyBankTransferCard,
  ArriveInThreeDaysEasyBankTransferCardComponent
} from '.'

export default {
  component: ArriveInThreeDaysEasyBankTransferCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Flyouts/BuySell/PaymentMethods/ArriveInThreeDaysEasyBankTransferCard'
} as ComponentMeta<ArriveInThreeDaysEasyBankTransferCardComponent>

const Template: ComponentStory<ArriveInThreeDaysEasyBankTransferCardComponent> = (args) => (
  <ArriveInThreeDaysEasyBankTransferCard {...args} />
)

export const Default = Template.bind({})
