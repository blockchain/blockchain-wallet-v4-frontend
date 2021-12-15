import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { OptionRightActionRow } from 'components/Rows'

const Column = styled.div`
  display: flex;
  flex-direction: column;
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
const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 40px;
  padding: 0 40px 0 32px;

  & > :first-child {
    margin-right: 16px;
  }
`

const rows = ({
  handleDeposit,
  handleReceive,
  handleSend,
  handleSwap,
  handleWithdraw
}): Array<RowType> => [
  {
    description: (
      <FormattedMessage
        id='modals.trade.swap.description'
        defaultMessage='Exchange Crypto for Another'
      />
    ),
    handleClick: handleSwap,
    header: <FormattedMessage id='buttons.swap' defaultMessage='Swap' />,
    iconColor: colors.blue600,
    iconName: 'swap'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.send.description'
        defaultMessage='Transfer to Another Wallet'
      />
    ),
    handleClick: handleSend,
    header: <FormattedMessage id='buttons.send' defaultMessage='Send' />,
    iconColor: colors.blue600,
    iconName: 'send'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.description'
        defaultMessage='Receive Crypto to Your Wallet'
      />
    ),
    handleClick: handleReceive,
    header: <FormattedMessage id='buttons.receive' defaultMessage='Receive' />,
    iconColor: colors.blue600,
    iconName: 'receive'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.description'
        defaultMessage='Add Cash to Your Cash Account'
      />
    ),
    handleClick: handleDeposit,
    header: <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />,
    iconColor: colors.blue600,
    iconName: 'deposit'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.description'
        defaultMessage='Cash Out to Your Bank Account'
      />
    ),
    handleClick: handleWithdraw,
    header: <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />,
    iconColor: colors.blue600,
    iconName: 'withdraw'
  }
]

const Trade = ({
  handleClose,
  handleDeposit,
  handleReceive,
  handleSend,
  handleSwap,
  handleWithdraw
}: OwnPropsType) => {
  return (
    <>
      <IconWrapper onClick={handleClose}>
        <Icon name='close' color='grey600' role='button' data-e2e='close' size='24px' cursor />
      </IconWrapper>
      <ContentContainer>
        {rows({ handleDeposit, handleReceive, handleSend, handleSwap, handleWithdraw }).map(
          ({ description, handleClick, header, iconColor, iconName }) => (
            <OptionRightActionRow
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
      <ButtonWrapper>
        <Button
          capitalize
          data-e2e='toSimpleBuyModal'
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
        >
          <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
        </Button>
        <Button capitalize data-e2e='skipTour' fullwidth height='48px' nature='dark' size='16px'>
          <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
        </Button>
      </ButtonWrapper>
    </>
  )
}

type OwnPropsType = {
  handleClose: () => void
  handleDeposit: () => void
  handleReceive: () => void
  handleSend: () => void
  handleSwap: () => void
  handleWithdraw: () => void
}

type RowType = {
  description: JSX.Element
  handleClick: () => void
  header: JSX.Element
  iconColor: string
  iconName: string
}

export default Trade
