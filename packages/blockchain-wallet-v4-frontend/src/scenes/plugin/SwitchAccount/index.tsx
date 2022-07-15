import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconClose } from '@blockchain-com/icons'
import { SwapAccountType } from 'blockchain-wallet-v4-frontend/src/data/components/swap/types'
import TotalBalance from 'blockchain-wallet-v4-frontend/src/layouts/Wallet/MenuLeft/Balances/TotalBalance'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import Account from './Account'

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 600px;
  padding: 27px 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  z-index: 2;
  background: ${(props) => props.theme.exchangeLogin};
  box-sizing: border-box;
`
const CloseButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
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
export const SwitchAccount = (props) => {
  const [copiedAccountIndex, setCopiedAccountIndex] = useState<string | number>('')
  const { accounts, selectedAccountIndex, setIsSwitchAccountVisible, setSelectedAccountIndex } =
    props

  const switchAccounts = [accounts.ETH, accounts.BTC, accounts.BCH, accounts.XLM, accounts.STX]
  const closeSwitchAccount = () => {
    setIsSwitchAccountVisible(false)
  }

  return (
    <Wrapper>
      <CloseButton onClick={closeSwitchAccount}>
        <IconWrapper>
          <CloseIconWrapper height='24px' width='24px' />
        </IconWrapper>
      </CloseButton>
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
