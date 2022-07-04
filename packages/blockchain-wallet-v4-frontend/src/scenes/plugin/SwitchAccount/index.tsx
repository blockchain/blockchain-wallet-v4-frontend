import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { IconClose } from '@blockchain-com/icons'
import { SwapAccountType } from 'blockchain-wallet-v4-frontend/src/data/components/swap/types'
import Failure from 'blockchain-wallet-v4-frontend/src/scenes/Prices/template.failure'
import Loading from 'blockchain-wallet-v4-frontend/src/scenes/Prices/template.loading'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { getTotalBalance } from 'components/Balances/total/selectors'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'

import Account from './Account'

const Wrapper = styled.div`
  height: 100%;
  padding: 27px 24px;
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
const CloseIconWrapper = styled(IconClose)`
  color: ${(props) => props.theme.grey400};
`
const SwitchAccount = (props) => {
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(0)
  const [copiedWalletAddress, setCopiedWalletAddress] = useState<string | number>('')
  const { accounts, data } = props

  const switchAccounts = [
    accounts.ETH[0],
    accounts.BTC[0],
    accounts.BCH[0],
    accounts.XLM[0],
    accounts.STX[0]
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
        <CloseIconWrapper height='24px' width='24px' onClick={closeSwitchAccountModal} />
      </IconWrapper>
      <HeaderText size='20px' color='white' weight={500}>
        <FormattedMessage id='plugin.switch.account.title' defaultMessage='Select account' />
      </HeaderText>
      {totalBalance}
      {switchAccounts.length &&
        switchAccounts.map((account: SwapAccountType, index: number) => (
          <Account
            key={account.coin}
            index={index}
            account={account}
            setSelectedAccountIndex={setSelectedAccountIndex}
            selectedAccountIndex={selectedAccountIndex}
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
