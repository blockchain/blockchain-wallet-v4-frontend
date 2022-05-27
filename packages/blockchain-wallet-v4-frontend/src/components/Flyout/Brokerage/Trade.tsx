import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  IconArrowDown,
  IconArrowUp,
  IconClose,
  IconMinus,
  IconPlus,
  IconSwap
} from '@blockchain-com/icons'
import styled, { css } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { OptionRightActionRow } from 'components/Rows'

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderText = styled(Text)`
  position: absolute;
  top: 40px;
  left: 40px;
`
const IconWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.grey100};
  height: 32px;
  width: 32px;
  cursor: pointer;
`
const ContentContainer = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 128px;

  & > div {
    width: 100%;
  }
`

const CustomIconWrapper = styled.div`
  ${({ theme }) => css`
    background: ${theme.blue100};
    color: ${theme.blue600}
    border-radius: 50%;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`

const rows = ({
  handleBuy,
  handleDeposit,
  handleSell,
  handleSwap,
  handleWithdraw
}): Array<RowType> => [
  {
    description: (
      <FormattedMessage id='modals.trade.buy.description' defaultMessage='Use Your Cash or Card' />
    ),
    handleClick: handleBuy,
    header: <FormattedMessage id='buttons.buy' defaultMessage='Buy' />,
    icon: (
      <CustomIconWrapper>
        <IconPlus fontSize={16} />
      </CustomIconWrapper>
    ),
    key: '0'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.sell.description'
        defaultMessage='Convert Your Crypto to Cash'
      />
    ),
    handleClick: handleSell,
    header: <FormattedMessage id='buttons.sell' defaultMessage='Sell' />,
    icon: (
      <CustomIconWrapper>
        <IconMinus fontSize={12} />
      </CustomIconWrapper>
    ),
    key: '1'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.swap.description'
        defaultMessage='Exchange Crypto for Another'
      />
    ),
    handleClick: handleSwap,
    header: <FormattedMessage id='buttons.swap' defaultMessage='Swap' />,
    icon: (
      <CustomIconWrapper>
        <IconSwap fontSize={16} />
      </CustomIconWrapper>
    ),
    key: '2'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.add_cash'
        defaultMessage='Add Cash to Your Cash Account'
      />
    ),
    handleClick: handleDeposit,
    header: <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />,
    icon: (
      <CustomIconWrapper>
        <IconArrowDown style={{ fontSize: 18 }} />
      </CustomIconWrapper>
    ),
    key: '3'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.cash_out'
        defaultMessage='Cash Out to Your Bank Account'
      />
    ),
    handleClick: handleWithdraw,
    header: <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />,
    icon: (
      <CustomIconWrapper>
        <IconArrowUp style={{ fontSize: 18 }} />
      </CustomIconWrapper>
    ),
    key: '4'
  }
]

const Trade = ({
  handleBuy,
  handleClose,
  handleDeposit,
  handleSell,
  handleSwap,
  handleWithdraw
}: Props) => {
  return (
    <>
      <HeaderText color='grey900' size='20px' weight={600}>
        <FormattedMessage id='modals.trade.header' defaultMessage='Shortcuts' />
      </HeaderText>
      <IconWrapper onClick={handleClose}>
        <IconClose />
      </IconWrapper>

      <ContentContainer>
        {rows({ handleBuy, handleDeposit, handleSell, handleSwap, handleWithdraw }).map(
          ({ description, handleClick, header, icon, key }) => (
            <OptionRightActionRow icon={icon} key={key} onClick={handleClick}>
              <Text color='grey900' weight={600}>
                {header}
              </Text>
              <Text color='grey600' size='14px' weight={500}>
                {description}
              </Text>
            </OptionRightActionRow>
          )
        )}
      </ContentContainer>
    </>
  )
}

type Props = {
  handleBuy: () => void
  handleClose: () => void
  handleDeposit: () => void
  handleSell: () => void
  handleSwap: () => void
  handleWithdraw: () => void
}

type RowType = {
  description: JSX.Element
  handleClick: () => void
  header: JSX.Element
  icon?: ReactNode
  key: string
}

export default Trade
