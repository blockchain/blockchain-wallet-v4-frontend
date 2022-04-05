import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconCart, IconQrCode, IconSell, IconSend } from '@blockchain-com/icons'

import { CoinfigType } from '@core/types'
import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const HoldingsCardActions = ({
  amount,
  buyButtonCallback,
  products,
  receiveButtonCallback,
  sellButtonCallback,
  sendButtonCallback
}: {
  amount: number
  buyButtonCallback: () => void
  products: CoinfigType['products']
  receiveButtonCallback: () => void
  sellButtonCallback: () => void
  sendButtonCallback: () => void
}): [ReactElement, ReactElement] => {
  const isBroke = amount <= 0
  const SendButton = (): ReactElement => (
    <Button
      nature='primary'
      data-e2e='sendButton'
      fullwidth
      disabled={isBroke}
      onClick={sendButtonCallback}
    >
      <Flex gap={10} alignItems='center'>
        <Icon label='send' color='white900' size='sm'>
          <IconSend />
        </Icon>
        <FormattedMessage id='buttons.send' defaultMessage='Send' />
      </Flex>
    </Button>
  )
  const ReceiveButton = (): ReactElement => (
    <Button nature='dark-grey' data-e2e='receiveButton' fullwidth onClick={receiveButtonCallback}>
      <Flex gap={10} alignItems='center'>
        <Icon color='white900' label='qrCode' size='sm'>
          <IconQrCode />
        </Icon>
        <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
      </Flex>
    </Button>
  )
  const BuyButton = (): ReactElement => (
    <Button nature='primary' key={1} data-e2e='buyButton' fullwidth onClick={buyButtonCallback}>
      <Flex gap={10} alignItems='center'>
        <Icon label='cart' color='white900' size='sm'>
          <IconCart />
        </Icon>
        <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
      </Flex>
    </Button>
  )
  const SellButton = (): ReactElement => (
    <Button
      nature='dark-grey'
      key={1}
      data-e2e='sellButton'
      fullwidth
      disabled={isBroke}
      onClick={sellButtonCallback}
    >
      <Flex gap={10} alignItems='center'>
        <Icon label='sell' color='white900' size='sm'>
          <IconSell />
        </Icon>
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
