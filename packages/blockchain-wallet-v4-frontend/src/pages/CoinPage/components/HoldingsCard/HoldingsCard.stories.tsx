import React from 'react'
import { IntlProvider } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { HoldingsCard, HoldingsCardComponent } from '.'

const holdingsCardStoriesMeta: ComponentMeta<HoldingsCardComponent> = {
  argTypes: {
    actions: {
      defaultValue: [
        <Button nature='primary' key={1} data-e2e='' fullwidth>
          <Flex gap={10} alignItems='center'>
            <Icon name='cart' color='white900' size='sm' />
            Buy
          </Flex>
        </Button>,
        <Button nature='dark-grey' key={2} data-e2e='' fullwidth>
          <Flex gap={10} alignItems='center'>
            <Icon color='white900' name='qrCode' size='sm' />
            Receive
          </Flex>
        </Button>
      ]
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

export default holdingsCardStoriesMeta
