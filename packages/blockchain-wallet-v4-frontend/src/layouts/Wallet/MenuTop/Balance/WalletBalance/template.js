import React from 'react'

import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'
import BchBalance from './BchBalance'
import { FormattedMessage } from 'react-intl'
import { Button, Text } from 'blockchain-info-components'
import { Wrapper, Header } from 'components/Balances'

const Template = props => (
  <Wrapper>
    <Header>
      <Text size='14px'>
        <FormattedMessage
          id='layouts.wallet.menutop.balance.walletbalance.wallet'
          defaultMessage='Wallet'
        />
      </Text>
      {props.currency && (
        <Button
          small
          width={'auto'}
          height={'auto'}
          size='11px'
          padding='3px'
          onClick={props.toggleCoinDisplayed}
          nature={props.coinDisplayed ? 'empty' : 'primary'}
        >
          {props.currency}
        </Button>
      )}
    </Header>
    <BtcBalance />
    <EthBalance />
    <BchBalance />
  </Wrapper>
)

export default Template
