import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { IconClose } from '@blockchain-com/icons'
import { SwapAccountType } from 'blockchain-wallet-v4-frontend/src/data/components/swap/types'
import TotalBalance from 'blockchain-wallet-v4-frontend/src/layouts/Wallet/MenuLeft/Balances/TotalBalance'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
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
  div {
    text-align: left;
    color: ${(props) => props.theme.grey400};
    margin: 0px 0 36px;
    font-size: 14px;
    font-weight: 500;
  }
`
const HeaderText = styled(Text)`
  margin: 30px 0 12px;
`
const CloseIconWrapper = styled(IconClose)`
  color: ${(props) => props.theme.grey400};
`
const SwitchAccount = (props) => {
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(0)
  const [copiedAccountIndex, setCopiedAccountIndex] = useState<string | number>('')
  const { accounts } = props

  const switchAccounts = [accounts.ETH, accounts.BTC, accounts.BCH, accounts.XLM, accounts.STX]

  return (
    <Wrapper>
      <IconWrapper>
        <CloseIconWrapper height='24px' width='24px' />
      </IconWrapper>
      <HeaderText size='20px' color='white' weight={500}>
        <FormattedMessage id='plugin.switch.account.title' defaultMessage='Select account' />
      </HeaderText>
      <BalanceText>
        <TotalBalance size='14px' weight={500} />
      </BalanceText>
      {switchAccounts.length &&
        switchAccounts.map((account: SwapAccountType[], index: number) => (
          <Account
            key={account[0].coin}
            index={index}
            account={account}
            setSelectedAccountIndex={setSelectedAccountIndex}
            selectedAccountIndex={selectedAccountIndex}
            setCopiedAccountIndex={setCopiedAccountIndex}
            copiedAccountIndex={copiedAccountIndex}
          />
        ))}
    </Wrapper>
  )
}

const mapStateToProps = (state) => {
  const data = selectors.balances.getTotalWalletBalance(state)
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })

  return { accounts, data }
}

export default connect(mapStateToProps, null)(SwitchAccount)
