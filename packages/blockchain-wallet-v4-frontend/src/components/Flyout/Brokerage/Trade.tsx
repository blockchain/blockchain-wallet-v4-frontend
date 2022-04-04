import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon as ConsIcon } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { OptionRightActionRow } from 'components/Rows'
import {
  IconArrowDown,
  IconArrowUp,
  IconMinusCircle,
  IconPlusCircle,
  IconSwap
} from '@blockchain-com/icons'

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

const CustomIconWrapper = styled.div<{ background?: string }>`
  background: ${({ background }) => background || colors.blue100};
  position: relative;
  border-radius: 50%;

  &:first-child {
    height: auto;
    margin-left: 0;
  }
`

const IconBG = styled.div`
  background: ${colors.blue600};
  border-radius: 50%;
  position: absolute;
  height: 16px;
  width: 16px;
  left: 4px;
  z-index: -1;
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
    key: '0',
    icon: (
      <CustomIconWrapper background='transparent'>
        <ConsIcon label='buy' color='blue100' size='md'>
          <IconPlusCircle />
        </ConsIcon>
        <IconBG />
      </CustomIconWrapper>
    )
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
    key: '1',
    icon: (
      <CustomIconWrapper background='transparent'>
        <ConsIcon label='sell' color='blue100' size='md'>
          <IconMinusCircle />
        </ConsIcon>
        <IconBG />
      </CustomIconWrapper>
    )
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
    key: '2',
    icon: (
      <CustomIconWrapper>
        <ConsIcon label='swap' color='blue600' size='md'>
          <IconSwap />
        </ConsIcon>
      </CustomIconWrapper>
    )
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
    key: '3',
    icon: (
      <CustomIconWrapper>
        <ConsIcon label='deposit' color='blue600' size='md'>
          <IconArrowDown />
        </ConsIcon>
      </CustomIconWrapper>
    )
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
    key: '4',
    icon: (
      <CustomIconWrapper>
        <ConsIcon label='withdraw' color='blue600' size='md'>
          <IconArrowUp />
        </ConsIcon>
      </CustomIconWrapper>
    )
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
        <Icon name='close' color='grey600' role='button' data-e2e='close' size='24px' cursor />
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
  key: string
  description: JSX.Element
  handleClick: () => void
  header: JSX.Element
  icon?: ReactNode
}

export default Trade
