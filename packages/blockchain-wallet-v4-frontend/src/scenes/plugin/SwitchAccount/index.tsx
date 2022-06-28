import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { IconClose } from '@blockchain-com/icons'
import Failure from 'blockchain-wallet-v4-frontend/src/scenes/Prices/template.failure'
import Loading from 'blockchain-wallet-v4-frontend/src/scenes/Prices/template.loading'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { getTotalBalance } from 'components/Balances/total/selectors'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { SwapBaseCounterTypes } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'

import { Account } from './Account'

const Wrapper = styled.div`
  /* height: 552px;
  padding: 27px 24px; */
  background: ${(props) => props.theme.exchangeLogin};
`
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`
const BalanceText = styled(Text)`
  margin: 0px 0 36px;
  color: ${(props) => props.theme.grey400};
`
const HeaderText = styled(Text)`
  margin: 30px 0 12px;
`
export class SwapAccountType {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public balance: number | string = '',
    public baseCoin: string,
    public coin: CoinType,
    public label: string,
    public type: SwapBaseCounterTypes,
    public accountIndex: number,
    public address: number | string,
    public archived?: boolean,
    public index?: number
  ) {}
}

const SwitchAccount = (props) => {
  const [activeAccountIndex, setActiveAccountIndex] = useState<number>(0)
  const [copiedWalletAddress, setCopiedWalletAddress] = useState<string | number>('')
  const coins = useSelector((state: RootState) => state.dataPath)
  const { accounts, data } = props

  const getWallet = (coin: string) => {
    if (!coins) return ''
    // for XML address
    if (!coins[coin].addresses) {
      return Object.keys(coins[coin].data)[0]
    }
    // for ETH, BTC, BCH addresses
    return Object.keys(coins[coin].addresses.data)[0]
  }

  const getAddressType = (coin: string) => {
    if (!accounts) return SwapBaseCounterTypes.CUSTODIAL
    return accounts[coin][0].typesetTooltipProperties
  }

  const switchAccounts: SwapAccountType[] = [
    new SwapAccountType(
      0,
      'Ethereum',
      'ETH',
      'Ethereum account',
      getAddressType('ETH'),
      0,
      getWallet('eth'),
      false,
      0
    ),
    new SwapAccountType(
      0,
      'Bitcoin',
      'BTC',
      'Bitcoin account',
      getAddressType('BTC'),
      1,
      getWallet('btc'),
      false,
      1
    ),
    new SwapAccountType(
      0,
      'Bitcoin Cash',
      'BCH',
      'Bitcoin Cash account',
      getAddressType('BCH'),
      2,
      getWallet('bch'),
      false,
      2
    ),
    new SwapAccountType(
      0,
      'XLM',
      'XLM',
      'XLM account',
      getAddressType('XLM'),
      3,
      getWallet('xlm'),
      false,
      3
    )
  ]

  const totalBalance = data.cata({
    Failure: () => <Failure />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (value) => (
      <BalanceText size='14px' weight={500}>
        {`Total Balance ${value.totalBalance}`}
      </BalanceText>
    )
  })

  const closeSwitchAccountModal = () => {
    // TODO: Close switch account modal window.
  }

  return (
    <Wrapper>
      <IconWrapper>
        <IconClose color='#98A1B2' height='24px' width='24px' onClick={closeSwitchAccountModal} />
      </IconWrapper>
      <HeaderText size='20px' color='white' weight={500}>
        Select account
      </HeaderText>
      {totalBalance}
      {switchAccounts.map((account: SwapAccountType) => (
        <Account
          key={account.accountIndex}
          account={account}
          setActiveAccountIndex={setActiveAccountIndex}
          activeAccountIndex={activeAccountIndex}
          setCopiedWalletAddress={setCopiedWalletAddress}
          copiedWalletAddress={copiedWalletAddress}
        />
      ))}
    </Wrapper>
  )
}

const mapStateToProps = (state) => {
  const data = getTotalBalance(state)
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })
  return { accounts, data }
}

export default connect(mapStateToProps, null)(SwitchAccount)
