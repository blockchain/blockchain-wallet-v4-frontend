import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button, Icon } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { defaultHoldingsCardActions } from '../../mocks/defaultHoldingsCardActions'
import { HoldingsCard, HoldingsCardComponent } from '.'
import { CoinTotalLoadingText, TotalLoadingText } from './HoldingsCard.styles'

const holdingsCardStoriesMeta: ComponentMeta<HoldingsCardComponent> = {
  argTypes: {
    actions: {
      defaultValue: defaultHoldingsCardActions
    },
    coinCode: {
      defaultValue: 'BTC'
    },
    coinTotal: {
      defaultValue: '0.0'
    },
    total: {
      defaultValue: '$0.00'
    }
  },
  component: HoldingsCard,
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>],
  title: 'Pages/CoinPage/HoldingsCard'
}

export const Template: ComponentStory<HoldingsCardComponent> = (args) => <HoldingsCard {...args} />

export const Bitcoin = Template.bind({})
Bitcoin.args = {
  coinCode: 'BTC',
  coinTotal: '0.00039387',
  total: '$7,926.43'
}

export const BitcoinEmpty = Template.bind({})
BitcoinEmpty.args = {
  coinCode: 'BTC',
  coinTotal: '0',
  total: '0'
}

export const Receive = Template.bind({})
Receive.args = {
  actions: [
    <Button nature='primary' key={1} data-e2e='' fullwidth>
      <Flex gap={10} alignItems='center'>
        <Icon name='qr-code' size='sm' color='white900' />
        Receive
      </Flex>
    </Button>
  ],
  coinCode: 'BTC',
  coinTotal: '0',
  total: '0'
}

export const Loading = Template.bind({})
Loading.args = {
  coinCode: 'BTC',
  coinTotal: <CoinTotalLoadingText />,
  total: <TotalLoadingText />
}

export default holdingsCardStoriesMeta
