import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { product } from 'ramda'

import { CoinfigType } from '@core/types'
import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const HoldingsCardActions = ({
  amount,
  products
}: {
  amount: number
  products: CoinfigType['products']
}): [ReactElement, ReactElement] => {
  const isBroke = amount <= 0
  const SendButton = (): ReactElement => (
    <Button nature='primary' data-e2e='sendButton' fullwidth disabled={isBroke}>
      <Flex gap={10} alignItems='center'>
        <Icon name='send' color='white900' size='sm' />
        <FormattedMessage id='buttons.send' defaultMessage='Send' />
      </Flex>
    </Button>
  )
  const ReceiveButton = (): ReactElement => (
    <Button nature='dark-grey' data-e2e='receiveButton' fullwidth>
      <Flex gap={10} alignItems='center'>
        <Icon color='white900' name='qrCode' size='sm' />
        <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
      </Flex>
    </Button>
  )
  const BuyButton = (): ReactElement => (
    <Button nature='primary' key={1} data-e2e='buyButton' fullwidth>
      <Flex gap={10} alignItems='center'>
        <Icon name='cart' color='white900' size='sm' />
        <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
      </Flex>
    </Button>
  )
  const SellButton = (): ReactElement => (
    <Button nature='dark-grey' key={1} data-e2e='sellButton' fullwidth disabled={isBroke}>
      <Flex gap={10} alignItems='center'>
        <Icon name='sell' color='white900' size='sm' />
        <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
      </Flex>
    </Button>
  )

  switch (true) {
    case products.includes('CustodialWalletBalance') && !isBroke: // user can buy/sell and has a balance
      return [<BuyButton key={1} />, <SellButton key={2} />]
    case products.includes('CustodialWalletBalance') && isBroke: // user has a balance
      return [<BuyButton key={1} />, <ReceiveButton key={2} />]
    case products.includes('PrivateKey') && isBroke: // user cannot buy/sell
    default:
      return [<SendButton key={1} />, <ReceiveButton key={2} />]
  }
}
