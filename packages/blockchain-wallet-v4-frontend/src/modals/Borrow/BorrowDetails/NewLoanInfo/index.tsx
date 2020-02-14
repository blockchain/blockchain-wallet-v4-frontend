import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { OwnProps, SuccessStateType } from '..'
import { Props } from '../template.success'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-top: 40px;
  margin-bottom: 64px;
`
const Item = styled.div`
  margin-bottom: 24px;
  display: flex;
`
const IconWrapper = styled.div<{ success?: boolean }>`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 20px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.success ? props.theme.green600 : props.theme.grey000};
`

const NewLoanInfo: React.FC<Props> = props => {
  const principalDisplayName =
    props.supportedCoins[props.loan.principal.amount[0].symbol].displayName

  return (
    <Wrapper>
      <Item>
        <IconWrapper success>
          <Icon name='check' size='12px' color='white' />
        </IconWrapper>
        <Text color='grey600' size='14px' weight={500}>
          <FormattedMessage
            id='scenes.borrow.details.newloan.created'
            defaultMessage='Loan has been created. Once your {symbol} deposit has been confirmed you will receive the loan amount in your wallet.'
            values={{ symbol: props.loan.collateral.amounts[0].symbol }}
          />
        </Text>
      </Item>
      <Item>
        <IconWrapper>
          <Icon name='timer' size='18px' color='grey600' />
        </IconWrapper>
        <Text color='grey600' size='14px' weight={500}>
          <FormattedMessage
            id='scenes.borrow.details.newloan.waiting'
            defaultMessage="Waiting on your deposit to be confirmed by the network. You don't need to take any action at this point."
          />
        </Text>
      </Item>
      <Item>
        <IconWrapper>
          <Icon name='wallet' size='18px' color='grey600' />
        </IconWrapper>
        <Text color='grey600' size='14px' weight={500}>
          <FormattedMessage
            id='scenes.borrow.details.newloan.receive'
            defaultMessage='You will receive {value} {symbol} to your Blockchain Wallet once we’ve received your deposit.'
            values={{
              value: props.loan.principal.amount[0].value,
              symbol: principalDisplayName
            }}
          />
        </Text>
      </Item>
    </Wrapper>
  )
}

export default NewLoanInfo
