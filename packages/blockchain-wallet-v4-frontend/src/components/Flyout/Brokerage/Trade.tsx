import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon } from '@blockchain-com/constellation'
import {
  IconArrowDown,
  IconArrowUp,
  IconClose,
  IconMinusCircle,
  IconPlusCircle,
  IconSwap
} from '@blockchain-com/icons'
import styled from 'styled-components'

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
const HoverIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
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
    iconComponent: () => (
      <CustomIconWrapper background='transparent'>
        <Icon label='circle plus' size='md' color='blue100'>
          <IconPlusCircle />
        </Icon>
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
    iconComponent: () => (
      <CustomIconWrapper background='transparent'>
        <Icon label='circle minus' size='md' color='blue100'>
          <IconMinusCircle />
        </Icon>
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
    iconComponent: () => (
      <CustomIconWrapper>
        <Icon label='swap' size='md' color='blue100'>
          <IconSwap />
        </Icon>
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
    iconComponent: () => (
      <CustomIconWrapper>
        <Icon label='arrow down' size='md' color='blue600'>
          <IconArrowDown />
        </Icon>
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
    iconComponent: () => (
      <CustomIconWrapper>
        <Icon label='arrow up' size='md' color='blue600'>
          <IconArrowUp />
        </Icon>
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
        {/* @ts-ignore */}
        <HoverIcon data-e2e='close' label='arrow up' size='md' color='grey600' role='button'>
          <IconClose />
        </HoverIcon>
      </IconWrapper>

      <ContentContainer>
        {rows({ handleBuy, handleDeposit, handleSell, handleSwap, handleWithdraw }).map(
          ({ description, handleClick, header, iconColor, iconComponent, iconName }) => (
            <OptionRightActionRow
              iconComponent={iconComponent}
              iconColor={iconColor}
              iconName={iconName}
              key={iconName}
              onClick={handleClick}
            >
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
  iconColor?: string
  iconComponent?: () => void
  iconName?: string
}

export default Trade
