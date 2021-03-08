import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, Image, Text } from 'blockchain-info-components'
import { SupportedWalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { mapObjIndexed, values } from 'ramda'
import styled from 'styled-components'

import { Header, Wrapper } from 'components/Balances'
import { BalancesWrapper } from '../model'
import Balance from './Balance'
import PendingSBTransactions from './PendingSBTransactions'

const Title = styled(Text)`
  display: flex;
  flex-direction: row;
  color: ${props => props.theme.grey800};
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
`

const Template = props => {
  const { coins } = props

  return (
    <Wrapper>
      <Header onClick={props.handleToggle} data-e2e='balanceDropdown-wallet'>
        <Title>
          <Image
            name='wallet-blue'
            size='22px'
            style={{ marginRight: '14px' }}
          />
          <FormattedMessage
            id='layouts.wallet.menutop.balance.walletbalance.wallet'
            defaultMessage='Wallet'
          />
        </Title>
        <Icon
          color='grey600'
          name='caret'
          size='10px'
          className={props.isActive ? 'active' : ''}
        />
      </Header>
      <PendingSBTransactions />
      <BalancesWrapper className={props.isActive ? 'active' : ''}>
        {values(
          mapObjIndexed(
            (coin: SupportedWalletCurrencyType) =>
              coin.method &&
              coin.invited && (
                <Balance
                  coin={coin.coinCode}
                  coinTicker={coin.coinTicker}
                  key={coin.coinCode}
                />
              ),
            coins
          )
        )}
      </BalancesWrapper>
    </Wrapper>
  )
}

export default Template
