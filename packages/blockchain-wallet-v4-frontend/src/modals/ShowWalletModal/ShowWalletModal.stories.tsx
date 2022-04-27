import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ShowWalletModalComponent } from '.'
import { ShowWalletModal } from './ShowWalletModal'

export default {
  component: ShowWalletModal,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Flyouts/ShowWallet'
} as ComponentMeta<ShowWalletModalComponent>

const Template: ComponentStory<ShowWalletModalComponent> = (args) => {
  return <ShowWalletModal {...args} />
}

export const BTC = Template.bind({})
BTC.args = {}
